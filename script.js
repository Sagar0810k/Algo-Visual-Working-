document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const arrayInput = document.getElementById('array-input');
    const generateRandomBtn = document.getElementById('generate-random');
    const algorithmSelect = document.getElementById('algorithm');
    const speedSlider = document.getElementById('speed');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const arrayContainer = document.getElementById('array-container');
    const algorithmDescription = document.getElementById('algorithm-description');
    const timeComplexity = document.getElementById('time-complexity');

    // Variables
    let array = [];
    let arrayBars = [];
    let isSorting = false;
    let animationSpeed = 101 - speedSlider.value; // Invert so higher value = faster

    // Algorithm information
    const algorithmInfo = {
        bubble: {
            name: 'Bubble Sort',
            description: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.',
            timeComplexity: {
                best: 'O(n)',
                average: 'O(n²)',
                worst: 'O(n²)'
            }
        },
        selection: {
            name: 'Selection Sort',
            description: 'Selection Sort is an in-place comparison sorting algorithm. It divides the input list into two parts: a sorted sublist of items which is built up from left to right, and a sublist of the remaining unsorted items. The algorithm repeatedly selects the smallest element from the unsorted sublist and moves it to the end of the sorted sublist.',
            timeComplexity: {
                best: 'O(n²)',
                average: 'O(n²)',
                worst: 'O(n²)'
            }
        },
        insertion: {
            name: 'Insertion Sort',
            description: 'Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort but can be efficient for small data sets.',
            timeComplexity: {
                best: 'O(n)',
                average: 'O(n²)',
                worst: 'O(n²)'
            }
        },
        merge: {
            name: 'Merge Sort',
            description: 'Merge Sort is an efficient, stable, comparison-based, divide and conquer sorting algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves.',
            timeComplexity: {
                best: 'O(n log n)',
                average: 'O(n log n)',
                worst: 'O(n log n)'
            }
        },
        quick: {
            name: 'Quick Sort',
            description: 'Quick Sort is an efficient, in-place sorting algorithm that uses a divide-and-conquer strategy. It works by selecting a "pivot" element from the array and partitioning the other elements into two sub-arrays according to whether they are less than or greater than the pivot.',
            timeComplexity: {
                best: 'O(n log n)',
                average: 'O(n log n)',
                worst: 'O(n²)'
            }
        }
    };

    // Update algorithm information
    function updateAlgorithmInfo() {
        const selectedAlgorithm = algorithmSelect.value;
        const info = algorithmInfo[selectedAlgorithm];
        
        algorithmDescription.innerHTML = `<p>${info.description}</p>`;
        timeComplexity.innerHTML = `
            <p>Best: ${info.timeComplexity.best}</p>
            <p>Average: ${info.timeComplexity.average}</p>
            <p>Worst: ${info.timeComplexity.worst}</p>
        `;
    }

    // Initialize with default algorithm info
    updateAlgorithmInfo();

    // Event listener for algorithm selection change
    algorithmSelect.addEventListener('change', updateAlgorithmInfo);

    // Generate random array
    function generateRandomArray(size = 15) {
        const min = 5;
        const max = 100;
        array = [];
        for (let i = 0; i < size; i++) {
            array.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
        renderArray();
    }

    // Parse user input array
    function parseInputArray() {
        const input = arrayInput.value.trim();
        if (input === '') return false;
        
        const values = input.split(',').map(val => parseInt(val.trim()));
        if (values.some(isNaN)) {
            alert('Please enter valid numbers separated by commas.');
            return false;
        }
        
        array = values;
        renderArray();
        return true;
    }

    // Render array as bars
    function renderArray() {
        arrayContainer.innerHTML = '';
        arrayBars = [];
        
        const maxValue = Math.max(...array);
        const containerWidth = arrayContainer.clientWidth;
        const barWidth = Math.min(50, (containerWidth / array.length) - 4);
        
        array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'array-bar fade-in';
            bar.style.height = `${(value / maxValue) * 100}%`;
            bar.style.width = `${barWidth}px`;
            bar.setAttribute('data-value', value);
            
            arrayContainer.appendChild(bar);
            arrayBars.push(bar);
        });
    }

    // Update a specific bar's height and value
    function updateBar(index, value) {
        const maxValue = Math.max(...array);
        arrayBars[index].style.height = `${(value / maxValue) * 100}%`;
        arrayBars[index].setAttribute('data-value', value);
    }

    // Reset array colors to default
    function resetArrayColors() {
        arrayBars.forEach(bar => {
            bar.className = 'array-bar';
        });
    }

    // Animation utilities using anime.js
    function animateCompare(indices) {
        return new Promise(resolve => {
            indices.forEach(index => {
                arrayBars[index].classList.add('comparing');
            });
            
            anime({
                targets: indices.map(index => arrayBars[index]),
                scale: [1, 1.1, 1],
                duration: animationSpeed * 10,
                easing: 'easeInOutQuad',
                complete: function() {
                    indices.forEach(index => {
                        arrayBars[index].classList.remove('comparing');
                    });
                    resolve();
                }
            });
        });
    }

    // Completely redesigned swap function
    function animateSwap(i, j) {
        return new Promise(resolve => {
            // Swap values in the actual array
            [array[i], array[j]] = [array[j], array[i]];
            
            // Get the DOM elements
            const bar1 = arrayBars[i];
            const bar2 = arrayBars[j];
            
            // Add swapping class
            bar1.classList.add('swapping');
            bar2.classList.add('swapping');
            
            // Get height values for animation
            const height1 = bar1.style.height;
            const height2 = bar2.style.height;
            
            // Get data values
            const value1 = bar1.getAttribute('data-value');
            const value2 = bar2.getAttribute('data-value');
            
            // Animate the height swap
            anime({
                targets: bar1,
                height: height2,
                duration: animationSpeed * 10,
                easing: 'easeInOutQuad'
            });
            
            anime({
                targets: bar2,
                height: height1,
                duration: animationSpeed * 10,
                easing: 'easeInOutQuad',
                complete: function() {
                    // Update data values
                    bar1.setAttribute('data-value', value2);
                    bar2.setAttribute('data-value', value1);
                    
                    // Remove swapping class
                    bar1.classList.remove('swapping');
                    bar2.classList.remove('swapping');
                    
                    resolve();
                }
            });
        });
    }

    function animateSorted(indices) {
        return new Promise(resolve => {
            if (!Array.isArray(indices)) {
                indices = [indices];
            }
            
            const bars = indices.map(index => arrayBars[index]);
            
            bars.forEach(bar => {
                bar.classList.add('sorted');
            });
            
            anime({
                targets: bars,
                scale: [1, 1.05, 1],
                duration: 300,
                easing: 'easeInOutQuad',
                complete: resolve
            });
        });
    }

    function animateArraySorted() {
        return new Promise(resolve => {
            const indices = Array.from(Array(array.length).keys());
            animateSorted(indices).then(resolve);
        });
    }

    // Bubble Sort Algorithm
    async function bubbleSort() {
        const n = array.length;
        
        for (let i = 0; i < n; i++) {
            let swapped = false;
            
            for (let j = 0; j < n - i - 1; j++) {
                // Compare adjacent elements
                await animateCompare([j, j + 1]);
                
                if (array[j] > array[j + 1]) {
                    // Swap elements
                    await animateSwap(j, j + 1);
                    swapped = true;
                }
            }
            
            // Mark the last element as sorted
            await animateSorted(n - i - 1);
            
            // If no swapping occurred in this pass, array is sorted
            if (!swapped) {
                // Mark all remaining elements as sorted
                const remainingIndices = Array.from(Array(n - i - 1).keys());
                if (remainingIndices.length > 0) {
                    await animateSorted(remainingIndices);
                }
                break;
            }
        }
    }

    // Selection Sort Algorithm
    async function selectionSort() {
        const n = array.length;
        
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            
            // Find the minimum element in the unsorted part
            for (let j = i + 1; j < n; j++) {
                await animateCompare([minIndex, j]);
                
                if (array[j] < array[minIndex]) {
                    minIndex = j;
                }
            }
            
            // Swap the found minimum element with the first element
            if (minIndex !== i) {
                await animateSwap(i, minIndex);
            }
            
            // Mark the element as sorted
            await animateSorted(i);
        }
        
        // Mark the last element as sorted
        await animateSorted(n - 1);
    }

    // Insertion Sort Algorithm
    async function insertionSort() {
        const n = array.length;
        
        // Mark first element as sorted
        await animateSorted(0);
        
        for (let i = 1; i < n; i++) {
            // Store the current value to be inserted
            const currentValue = array[i];
            let j = i - 1;
            
            // Highlight current element being inserted
            arrayBars[i].classList.add('comparing');
            
            await new Promise(resolve => {
                setTimeout(resolve, animationSpeed * 10);
            });
            
            // Move elements greater than currentValue one position ahead
            while (j >= 0 && array[j] > currentValue) {
                await animateCompare([j, j + 1]);
                
                // Move element forward
                array[j + 1] = array[j];
                updateBar(j + 1, array[j]);
                
                j--;
            }
            
            // Place currentValue in its correct position
            array[j + 1] = currentValue;
            updateBar(j + 1, currentValue);
            
            // Remove comparing class
            arrayBars[i].classList.remove('comparing');
            
            // Mark elements up to current position as sorted
            for (let k = 0; k <= i; k++) {
                await animateSorted(k);
            }
        }
    }

    // Merge Sort Algorithm
    async function mergeSort() {
        await mergeSortHelper(0, array.length - 1);
    }
    
    async function mergeSortHelper(start, end) {
        if (start >= end) return;
        
        const mid = Math.floor((start + end) / 2);
        
        // Recursively sort both halves
        await mergeSortHelper(start, mid);
        await mergeSortHelper(mid + 1, end);
        
        // Merge the sorted halves
        await merge(start, mid, end);
    }
    
    async function merge(start, mid, end) {
        const leftSize = mid - start + 1;
        const rightSize = end - mid;
        
        // Create temporary arrays
        const leftArray = array.slice(start, mid + 1);
        const rightArray = array.slice(mid + 1, end + 1);
        
        let i = 0, j = 0, k = start;
        
        // Merge the two arrays back into the original array
        while (i < leftSize && j < rightSize) {
            // Compare elements from both subarrays
            await animateCompare([start + i, mid + 1 + j]);
            
            if (leftArray[i] <= rightArray[j]) {
                array[k] = leftArray[i];
                updateBar(k, leftArray[i]);
                i++;
            } else {
                array[k] = rightArray[j];
                updateBar(k, rightArray[j]);
                j++;
            }
            
            // Temporarily highlight the merged element
            arrayBars[k].classList.add('comparing');
            
            await new Promise(resolve => {
                setTimeout(() => {
                    arrayBars[k].classList.remove('comparing');
                    resolve();
                }, animationSpeed * 5);
            });
            
            k++;
        }
        
        // Copy remaining elements from left subarray
        while (i < leftSize) {
            array[k] = leftArray[i];
            updateBar(k, leftArray[i]);
            
            arrayBars[k].classList.add('comparing');
            
            await new Promise(resolve => {
                setTimeout(() => {
                    arrayBars[k].classList.remove('comparing');
                    resolve();
                }, animationSpeed * 5);
            });
            
            i++;
            k++;
        }
        
        // Copy remaining elements from right subarray
        while (j < rightSize) {
            array[k] = rightArray[j];
            updateBar(k, rightArray[j]);
            
            arrayBars[k].classList.add('comparing');
            
            await new Promise(resolve => {
                setTimeout(() => {
                    arrayBars[k].classList.remove('comparing');
                    resolve();
                }, animationSpeed * 5);
            });
            
            j++;
            k++;
        }
        
        // If this is the final merge (full array), mark all as sorted
        if (start === 0 && end === array.length - 1) {
            const indices = Array.from(Array(array.length).keys());
            await animateSorted(indices);
        }
    }

    // Quick Sort Algorithm
    async function quickSort() {
        await quickSortHelper(0, array.length - 1);
    }
    
    async function quickSortHelper(low, high) {
        if (low < high) {
            // Partition the array and get the pivot index
            const pivotIndex = await partition(low, high);
            
            // Mark pivot as sorted
            await animateSorted(pivotIndex);
            
            // Recursively sort elements before and after pivot
            await quickSortHelper(low, pivotIndex - 1);
            await quickSortHelper(pivotIndex + 1, high);
        } else if (low === high) {
            // Single element is already sorted
            await animateSorted(low);
        }
    }
    
    async function partition(low, high) {
        // Choose the rightmost element as pivot
        const pivot = array[high];
        
        // Highlight pivot
        arrayBars[high].classList.add('comparing');
        
        let i = low - 1;
        
        for (let j = low; j < high; j++) {
            // Compare current element with pivot
            await animateCompare([j, high]);
            
            if (array[j] <= pivot) {
                i++;
                
                // Swap array[i] and array[j]
                if (i !== j) {
                    await animateSwap(i, j);
                }
            }
        }
        
        // Swap array[i+1] and array[high] (pivot)
        if (i + 1 !== high) {
            await animateSwap(i + 1, high);
        }
        
        // Remove highlighting from pivot
        arrayBars[high].classList.remove('comparing');
        
        return i + 1;
    }

    // Start sorting based on selected algorithm
    async function startSorting() {
        if (isSorting) return;
        
        if (array.length === 0) {
            if (!parseInputArray()) {
                generateRandomArray();
            }
        }
        
        isSorting = true;
        startBtn.disabled = true;
        arrayInput.disabled = true;
        generateRandomBtn.disabled = true;
        algorithmSelect.disabled = true;
        
        resetArrayColors();
        
        const selectedAlgorithm = algorithmSelect.value;
        
        switch (selectedAlgorithm) {
            case 'bubble':
                await bubbleSort();
                break;
            case 'selection':
                await selectionSort();
                break;
            case 'insertion':
                await insertionSort();
                break;
            case 'merge':
                await mergeSort();
                break;
            case 'quick':
                await quickSort();
                break;
        }
        
        await animateArraySorted();
        
        isSorting = false;
        startBtn.disabled = false;
        arrayInput.disabled = false;
        generateRandomBtn.disabled = false;
        algorithmSelect.disabled = false;
    }

    // Event Listeners
    generateRandomBtn.addEventListener('click', () => {
        generateRandomArray();
    });

    arrayInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            parseInputArray();
        }
    });

    speedSlider.addEventListener('input', () => {
        animationSpeed = 101 - speedSlider.value;
    });

    startBtn.addEventListener('click', startSorting);

    resetBtn.addEventListener('click', () => {
        if (isSorting) return;
        
        array = [];
        arrayInput.value = '';
        arrayContainer.innerHTML = '';
        startBtn.disabled = false;
        arrayInput.disabled = false;
        generateRandomBtn.disabled = false;
        algorithmSelect.disabled = false;
    });

    // Initialize with random array
    generateRandomArray();

    // Add welcome animation
    const anime = window.anime;

    anime({
        targets: '.container',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 1000,
        easing: 'easeOutQuad'
    });
});