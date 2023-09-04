function replaceZero(motionAnalysisArray) {
  const result = [];

  for (let i = 0; i < motionAnalysisArray.length; i++) {
    if (motionAnalysisArray[i] !== 0) {
      result.push(motionAnalysisArray[i]);
    } else {
      const prevNonZeroIndex = i - 1;
      let currZeroIndex = i;
      let nextNonZeroIndex = i + 1;
      let count = 0;
      let gap = 2;

      if (!i) {
        while (!motionAnalysisArray[currZeroIndex]) {
          currZeroIndex++;
        }

        result.push(motionAnalysisArray[currZeroIndex]);
        continue;
      }

      while (
        nextNonZeroIndex < motionAnalysisArray.length &&
        motionAnalysisArray[nextNonZeroIndex] === 0
      ) {
        nextNonZeroIndex++;
        gap++;
      }

      const increment = Math.round(
        (motionAnalysisArray[nextNonZeroIndex] -
          motionAnalysisArray[prevNonZeroIndex]) /
          gap,
      );

      for (let j = i + 1; j < i + gap; j++) {
        count++;
        result.push(motionAnalysisArray[prevNonZeroIndex] + increment * count);
      }

      i += count - 1;
    }
  }

  return result;
}

function flattenArray(arrayWithoutZero) {
  const result = arrayWithoutZero;

  for (let i = 1; i < result.length; i++) {
    const prev = result[i - 1];
    const curr = result[i];
    const next = result[i + 1];

    if (
      Math.abs(prev - curr) >= 4 &&
      Math.abs(next - curr) >= 4 &&
      Math.abs(prev - next) <= 5
    ) {
      result[i] = Math.round((prev + next) / 2);
    }
  }

  return result;
}

function scaleUpArray(flattenedArray, videoWidth) {
  const result = [];

  for (let i = 0; i < flattenedArray.length; i++) {
    const prevValue = (videoWidth / 100) * flattenedArray[i];

    result.push(Math.round(prevValue));

    if (flattenedArray[i + 1]) {
      const nextValue = (videoWidth / 100) * flattenedArray[i + 1];
      const middleValue = (nextValue + prevValue) / 2;

      result.push(Math.round(middleValue));
    }
  }

  return result;
}

function applySensitivity(scaledUpArray, sensitivity) {
  const result = [];
  const bifurcation = Number(sensitivity);

  for (let i = 0; i < scaledUpArray.length; i += bifurcation) {
    const currValue = scaledUpArray[i];
    let count = 0;
    let gap = bifurcation;

    if (scaledUpArray[i + gap]) {
      const nextValue = scaledUpArray[i + gap];

      const increment = Math.round((nextValue - currValue) / gap);
      result.push(currValue);

      for (let j = i + 1; j < i + gap; j++) {
        count++;
        result.push(currValue + increment * count);
      }
    } else {
      gap = scaledUpArray.length - 1 - i;
      const lastValue = scaledUpArray[i + gap];

      const increment = Math.round((lastValue - currValue) / gap);
      result.push(currValue);

      for (let j = i + 1; j < i + gap; j++) {
        count++;
        result.push(currValue + increment * count);
      }

      result.push(lastValue);
    }
  }

  return result;
}

function adjustLengthOfArray(optimizedArray) {
  const result = [];

  for (let i = 0; i < optimizedArray.length; i++) {
    if (i === 0 || i % 26 !== 0) {
      result.push(optimizedArray[i]);
    }
  }

  result.push(optimizedArray[optimizedArray.length - 1]);

  return result;
}

exports.optimizeArray = async (
  motionAnalysisArray,
  sensitivity,
  videoWidth,
) => {
  const arrayWithoutZero = replaceZero(motionAnalysisArray);
  const flattenedArray = flattenArray(arrayWithoutZero);
  const scaledUpArray = scaleUpArray(flattenedArray, videoWidth);
  const optimizedArray = applySensitivity(scaledUpArray, sensitivity);
  const finalResult = adjustLengthOfArray(optimizedArray);

  return finalResult;
};
