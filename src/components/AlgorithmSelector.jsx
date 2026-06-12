const algorithms = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'selection', label: 'Selection Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'merge', label: 'Merge Sort' },
  { value: 'quick', label: 'Quick Sort' },
  { value: 'heap', label: 'Heap Sort' },
  { value: 'counting', label: 'Counting Sort' },
  { value: 'radix', label: 'Radix Sort' },
  { value: 'bucket', label: 'Bucket Sort' }
];

export default function AlgorithmSelector({ value, onChange }) {
  return (
    <label className="field">
      <span>Sorting algorithm</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {algorithms.map((algorithm) => (
          <option key={algorithm.value} value={algorithm.value}>
            {algorithm.label}
          </option>
        ))}
      </select>
    </label>
  );
}
