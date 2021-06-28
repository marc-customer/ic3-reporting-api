import {ITidyColumn} from "./PublicTidyColumn";

/**
 * a tree node that with origin in a TidyColumn
 */
export interface TidyTreeNode {

    /**
     * the column the tree node was generated from
     */
    originColumn?: ITidyColumn;

    /**
     * the first index position that generated the column (some column are repetition of a same pattern)
     */
    firstIdx: number;

    /**
     * the label/value of this node
     */
    nodeLabel: any;

    /**
     * children of this tree
     */
    children: TidyTreeNode[];

    /**
     * the measures associated with a given node (by default just leaf nodes have values)
     */
    measures: any[];
}

/**
 * A tree structure that was generated from a TidyTable with measures associated on each
 * node. It makes 'sense'
 *
 * Bear in mind not all measures can be aggregated with a SUM
 *
 * root
 *  |
 *  --- Europe  3
 *  |     |
 *  |     --- Spain 1
 *  |     |
 *  |     --- France 2
 *  |
 *  --- America  4
 *       |
 *       --- US 4
 *
 * the values of the measures are added to the leafs
 */
export class TidyTree {

    measures: ITidyColumn[];

    root: TidyTreeNode;

    constructor(measures: ITidyColumn[], root?: TidyTreeNode) {
        this.measures = measures;
        this.root = root ?? {
            firstIdx: -1,
            nodeLabel: 'root',
            children: [],
            measures: []
        };
    }

    /**
     * Performs the specified action on each node of the tree
     *
     * if callbackfn return false, it will not perform a foreach on it's children
     */
    foreach(callbackfn: (node: TidyTreeNode, levelDepth: number, parentNode: TidyTreeNode | undefined, nodeChildrenIdx: number) => boolean | void): void {
        function forEachNested(children: TidyTreeNode[], levelDepth: number, parent: TidyTreeNode, callbackfn: (node: TidyTreeNode, levelDepth: number, parentNode: TidyTreeNode | undefined, nodeChildrenIdx: number) => boolean | void) {
            children.forEach((node, idx) => {
                if (callbackfn(node, levelDepth, parent, idx) !== false) {
                    forEachNested(node.children, levelDepth + 1, node, callbackfn);
                }
            })
        }

        if (callbackfn(this.root, 0, undefined, 0) !== false) {
            forEachNested(this.root.children, 1, this.root, callbackfn);
        }
    }

    /**
     * A unique id for each node of the tree
     * returns levelDepth + "--" + node.nodeLabel
     */
    static uniqueId(node: TidyTreeNode, levelDepth: number): string {
        return levelDepth + "--" + node.nodeLabel;
    }

    /**
     * aggregates all children measures values on parents using aggregation function recursively
     *
     * aggrfn is sum by default
     */
    aggregateOnParents(aggrfn?: (a: any | null, b: any | null) => any) {

        const aggregateValues = aggrfn ?? sumAggregation;

        function aggregateChildren(children: TidyTreeNode[]) {
            const nodeMeasures: any[] = [];

            children.forEach(node => {
                const measValues = node.children.length !== 0 ? aggregateChildren(node.children) : node.measures;
                node.measures = measValues;

                for (let i = 0; i < measValues.length; i++) {
                    const childMeasure = measValues[i];
                    if (childMeasure != null) {
                        nodeMeasures[i] = aggregateValues(nodeMeasures[i], childMeasure);
                    }
                }
            });

            return nodeMeasures;
        }

        this.root.measures = aggregateChildren(this.root.children);
    }

    /**
     * Aggregates for all no root nodes on the uniqueId at measureIdx
     *
     * if the getter returns the leveldepth it will aggregate all nodes for the same level.
     * if the getter returns the nodelabel it will aggregate all nodes with the same label (you can add the level depth to ensure uniqueness).
     *
     */
    aggregateOnId<ID_TYPE>(idGetter: (node: TidyTreeNode, levelDepth: number) => ID_TYPE, measureIdx = 0, aggrfn?: (a: any | null, b: any | null) => any): Map<ID_TYPE, any> {
        const nodeValues = new Map<ID_TYPE, any>();
        const aggregateValues = aggrfn ?? sumAggregation;

        this.foreach((node, levelDepth) => {
            const id = idGetter(node, levelDepth);
            nodeValues.set(id, aggregateValues(nodeValues.get(id), node.measures[measureIdx]));
        });

        return nodeValues;
    }
}

function sumAggregation(a: any, b: any) {
    if (a == null)
        return b;
    if (b == null)
        return a;
    return a + b;
}

