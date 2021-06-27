import {ITidyBaseColumn, ITidyColumn, ITidyNumericColumn} from "./PublicTidyColumn";
import {HistogramData} from "./PublicTidyTableTypes";

export type RealValuedFunction = (x: number) => number;

interface ITidyMath {
    /**
     * Mathematical functions, null is counted as zero in the sum.
     */
    sum(column: ITidyNumericColumn): number;

    /**
     * Get the extreme value of the column. Null values are skipped.
     * @param column
     * @returns the minimum value of the column. Returns undefined if the column has no values or if the column contains
     * a NaN-value.
     */
    min<T>(column: ITidyBaseColumn<T>): T | undefined;

    /**
     * Get the extreme value of the column. Null values are skipped.
     * @param column
     * @returns the maximum value of the column. Returns undefined if the column has no values or if the column contains
     * a NaN-value.
     */
    max<T>(column: ITidyBaseColumn<T>): T | undefined;

    /**
     * Sum all values matching the lowest depth level of axis column
     */
    sumOnRoot(column: ITidyNumericColumn, tree: ITidyColumn): number;

    /**
     * Estimate the population mean of the column, skipping null values.
     *
     * @returns the mean of the numeric column. Returns undefined if the column has no values or if the column contains
     * a NaN-value.
     */
    mean(column: ITidyNumericColumn): number | undefined;

    /**
     * Estimate the population variance of the column. Null values are skipped.
     * @param column
     * @returns the variance of the column. Returns undefined if the column has no values or if the column contains a
     * NaN-value.
     */
    variance(column: ITidyNumericColumn): number | undefined;

    /**
     * Return the number of non-null values in the column.
     */
    count(column: ITidyColumn): number;

    /**
     * Calculate the median of the column. Null-values are ignored.
     * @param column
     * @returns the median of the numeric column. Returns undefined if the column has no values or if the column contains
     * a NaN-value.
     */
    median(column: ITidyNumericColumn): number | undefined;

    /**
     * Creates a histogram data object from the column.
     * @param column
     * @param numberOfBins the maximum number of bins.
     */
    hist(column: ITidyNumericColumn, numberOfBins?: number): HistogramData[];

    ols(column: ITidyNumericColumn): RealValuedFunction | undefined;

    /**
     * Calculate the percentage w.r.t. the total of the column.
     * @param column
     * @param idx row index of the cell to calculate the percentage of.
     */
    percent(column: ITidyNumericColumn, idx: number): number | undefined;

    /**
     * Count the values in the column. For example: [a, b, b] -> {a: 1, b: 2}.
     */
    valueCounts<T>(column: ITidyBaseColumn<T>): Map<T, number>;

    /**
     * Scale a numeric column so that its values are on [-1, 1].
     * For each value x, return x / max(|x_1|, ..., |x_n|).
     *
     * @returns undefined if one of the values in the scalar could not be calculated.
     */
    scaleMaxAbsolute(column: ITidyNumericColumn): RealValuedFunction | undefined;

    /**
     * Normalize a numeric column so that its values are on [0, 1].
     * For each value x, return (x - x_min) / (x_max - x_min).
     *
     * @returns undefined if one of the values in the scalar could not be calculated.
     */
    scaleNormalize(column: ITidyNumericColumn): RealValuedFunction | undefined;

    /**
     * Standardize the column.
     * For each value x, return (x - x_mean) / x_stdev.
     *
     * @returns undefined if one of the values in the scalar could not be calculated.
     */
    scaleStandardize(column: ITidyNumericColumn): RealValuedFunction | undefined;
}

class TidyMathImpl implements ITidyMath {
    percent(column: ITidyNumericColumn, idx: number): number | undefined {
        const value = column.getValue(idx);
        if (value != null) {
            return value / this.sum(column);
        }
        return undefined;
    }

    scaleMaxAbsolute(column: ITidyNumericColumn): RealValuedFunction | undefined {
        let max = 0;
        for (let i = 0; i < column.length(); i++) {
            const val = column.getValue(i);
            if (val != null) {
                if (isNaN(val)) return undefined;
                const v = Math.abs(val);
                if (v > max) max = v;
            }
        }
        return (x: number) => x / max;
    }

    scaleNormalize_(column: ITidyNumericColumn, idx: number, min: number | undefined, max: number | undefined, val: number | undefined): number | undefined {

        if (min == null) {
            min = TidyMath.min(column) ?? undefined;
        }

        if (max == null) {
            max = TidyMath.max(column) ?? undefined;
        }

        if (val == null) {
            val = column.getValue(idx) ?? undefined;
        }

        if (min == null || max == null || val == null) {
            return undefined;
        }

        if (min === max) {
            return 1;
        }

        return (val - min) / (max - min);
    }

    scaleNormalize(column: ITidyNumericColumn): RealValuedFunction | undefined {
        const max = this.max(column);
        const min = this.min(column);
        if (min == null || max == null) {
            return undefined;
        }
        const range = max - min;
        return (x: number) => (x - min) / range;
    }

    scaleStandardize(column: ITidyNumericColumn): RealValuedFunction | undefined {
        const mean = this.mean(column);
        const variance = this.variance(column);
        if (variance == null || mean == null) {
            return undefined;
        }
        const stdev = Math.sqrt(variance);
        return (x: number) => (x - mean) / stdev;
    }

    @cached
    variance(column: ITidyNumericColumn): number | undefined {

        const count = this.count(column);
        const columnMean = this.mean(column);
        if (columnMean == null) {
            return undefined;
        }
        let sum_errors_squared = 0;
        for (let i = 0; i < column.length(); i++) {
            const value = column.getValue(i);
            if (value != null) {
                sum_errors_squared += (value - columnMean) ** 2;
            }
        }
        const dof = count - 1;
        if (dof === 0)
            return undefined;

        return sum_errors_squared / dof;
    }

    @cached
    sum(column: ITidyNumericColumn): number {
        if (column.length() === 0) {
            return 0;  // https://en.wikipedia.org/wiki/Empty_sum
        }
        return column.getValues().reduce((a, b) => (a ?? 0) + (b ?? 0)) ?? 0;
    }

    @cached
    min<T>(column: ITidyBaseColumn<T>): T | undefined {
        let result: T | undefined = undefined;
        for (let i = 0; i < column.length(); i++) {
            const value = column.getValue(i);
            if (typeof value === "number" && isNaN(value)) {
                return undefined;
            }
            if (value == null) {
                continue;
            }
            if (result === undefined) {
                result = value;
            } else if (column.compare(value, result) < 0) {
                result = value;
            }
        }
        return result;
    }

    @cached
    max<T>(column: ITidyBaseColumn<T>): T | undefined {
        let result: T | undefined = undefined;
        for (let i = 0; i < column.length(); i++) {
            const value = column.getValue(i);
            if (typeof value === "number" && isNaN(value)) {
                return undefined;
            }
            if (value == null) {
                continue;
            }
            if (result === undefined) {
                result = value;
            } else if (column.compare(value, result) > 0) {
                result = value;
            }
        }
        return result;
    }

    sumOnRoot(column: ITidyNumericColumn, tree: ITidyBaseColumn<any>): number {
        if (tree.isHierarchy() && tree.length()) {
            let sum = 0;
            const N = column.length();
            for (let i = 0; i < N; i++) {
                const cLevel = tree.getLevelDepth(i) || 0;
                if (cLevel <= 0) {
                    sum += column.getValue(i) ?? 0;
                }
            }
            return sum;
        } else {
            return this.sum(column);
        }
    }

    @cached
    count(column: ITidyColumn): number {
        let count = 0;
        column.getValues().forEach(v => v != null && count++);
        return count;
    }

    @cached
    mean(column: ITidyNumericColumn): number | undefined {
        const count = this.count(column);
        if (count !== 0) {
            const sum = this.sum(column);
            if (sum != null && !isNaN(sum)) {
                return sum / count;
            }
        }
        return undefined;
    }

    @cached
    median(column: ITidyNumericColumn): number | undefined {

        const values: number[] = [];

        for (const v of column.getValues()) {
            if (v != null) {
                if (isNaN(v))
                    return undefined;
                values.push(v);
            }
        }

        if (values.length === 0) {
            return undefined;
        }

        if (values.length === 1) {
            return values[0];
        }

        values.sort();
        const half = Math.floor(values.length / 2);

        if (values.length % 2)
            return values[half];

        return (values[half - 1] + values[half]) / 2.0;
    }

    hist(column: ITidyNumericColumn, numberOfBins = 10): HistogramData[] {

        const valueMin = this.min(column)
        const valueMax = this.max(column)

        if (numberOfBins <= 0 || column.length() === 0 || valueMin == null || valueMax == null) {
            return [];
        }

        const valueRange = valueMax - valueMin;

        if (valueRange === 0) {
            return [{
                from: valueMin,
                to: valueMax,
                count: column.length()
            }];
        }

        const valueStep = valueRange / numberOfBins;
        const binData = new Array<HistogramData>(numberOfBins);
        for (let b = 0; b < numberOfBins; b++) {
            binData[b] = {
                from: valueMin + valueStep * b,
                to: valueMin + valueStep * (b + 1),
                count: 0
            };
        }
        column.getValues().forEach(value => {
            if (value != null) {
                const b = Math.floor((value - valueMin) / valueRange * (numberOfBins - 1));
                binData[b].count++;
            }
        })
        return binData;
    }

    ols(column: ITidyNumericColumn): RealValuedFunction | undefined {

        const values: number[] = [];
        column.getValues().forEach(v => v && values.push(v));

        const data = values.map((value, index) => [index, value]);

        if (data.length < 2) {
            return undefined;
        }

        const sum_y = data.reduce((a, b) => a + b[1], 0);

        const sum_x = data.reduce((a, b) => a + b[0], 0);
        const sum_x_squared = data.reduce((a, b) => a + b[0] * b[0], 0);

        const variance_x = sum_x_squared - sum_x * sum_x / data.length;

        const cov = data.reduce((a, b) => a + b[0] * b[1], 0) - sum_x * sum_y / data.length;

        const b = cov / variance_x;
        const a = sum_y / data.length - b * sum_x / data.length;

        if (isNaN(b) || isNaN(a)) {
            return undefined;
        }

        return (x: number) => {
            return a + b * x;
        }

    }

    valueCounts<T>(column: ITidyBaseColumn<T>): Map<T, number> {
        const counts = new Map<T, number>();
        column.getValues().forEach(value => {
            counts.set(value, (counts.get(value) ?? 0) + 1);
        })
        return counts;
    }
}

/**
 * Cache the result of the function in the column. Note, the function should have one argument which is the column.
 */
function cached(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<(column: ITidyColumn) => any>) {
    const originalMethod = descriptor.value;
    descriptor.value = function (column: ITidyColumn) {
        const cachedValue = column.getCachedValue(propertyName);
        if (cachedValue != null) {
            return cachedValue;
        }
        const returnValue = originalMethod?.apply(this, [column]);
        column.setCachedValue(propertyName, returnValue);
        return returnValue;
    };
}

export const TidyMath = new TidyMathImpl();