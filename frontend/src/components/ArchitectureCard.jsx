// import { useSelectedItem } from "../SelectedItemContext";

// export default function ArchitectureCard({ data }) {
//   const { setItem } = useSelectedItem();

//   return (
//     <button
//       onClick={() => setItem(data)}
//       className="text-left group rounded-xl bg-white shadow
//                  transition hover:shadow-lg hover:-translate-y-0.5
//                  focus:outline-none focus:ring-2 focus:ring-brand/50"
//     >
//       <div className="p-4 h-full">
//         <h3 className="font-semibold mb-1">{data.title}</h3>
//         <p
//           className="text-sm text-gray-600 line-clamp-3
//                      group-hover:line-clamp-none
//                      group-focus-visible:line-clamp-none"
//         >
//           {data.description}
//         </p>
//       </div>
//     </button>
//   );
// }

export default function ArchitectureCard({ item, onClick }) {
  return (
    <div
      onClick={() => onClick(item)}
      className="cursor-pointer border border-blue-300 bg-white p-4 rounded-xl shadow hover:shadow-md transition"
    >
      <h3 className="font-semibold text-lg text-blue-900">{item.title}</h3>
      <p className="text-gray-600 line-clamp-3">{item.description}</p>
    </div>
  );
}
