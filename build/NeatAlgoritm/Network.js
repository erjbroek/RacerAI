export default class Genome {
    inputSize;
    hiddenSize;
    outputSize;
    weightsIH;
    weightsHO;
    constructor(inputSize, hiddenSize, outputSize) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.weightsIH = this.initializeWeights(inputSize, hiddenSize);
        this.weightsHO = this.initializeWeights(hiddenSize, outputSize);
    }
    initializeWeights(rows, cols) {
        const weights = [];
        for (let i = 0; i < rows; i++) {
            weights[i] = [];
            for (let j = 0; j < cols; j++) {
                weights[i][j] = Math.random() * 2 - 1;
            }
        }
        return weights;
    }
    feedForward(inputs) {
        const hidden = this.sigmoid(this.dotProduct(inputs, this.weightsIH));
        const outputs = this.sigmoid(this.dotProduct(hidden, this.weightsHO));
        return outputs;
    }
    dotProduct(vec, weights) {
        const output = [];
        for (let j = 0; j < weights[0].length; j++) {
            let sum = 0;
            for (let i = 0; i < vec.length; i++) {
                sum += vec[i] * weights[i][j];
            }
            output[j] = sum;
        }
        return output;
    }
    sigmoid(x) {
        return x.map((val) => 1 / (1 + Math.exp(-val)));
    }
}
//# sourceMappingURL=Network.js.map