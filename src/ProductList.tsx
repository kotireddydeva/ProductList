import React, { useState, useEffect } from 'react';
import down from './arrow-down-short.svg';
import up from './arrow-up-short.svg';

const dummyData = [
  { id: 1, Title: 'Banana', Price: 0.50, City: "Hyderabad", Name: 'Koti', Delevery: 'Free', Date: '2025-12-22' },
  { id: 2, Title: 'Apple', Price: 1.1214, City: "Pune", Country: "India", Date: '2025-12-13' },
  { id: 3, Title: 'Orange', Price: 0.980, City: "Chennai", Date: '2024-12-22' },
  { id: 4, Title: 'Mango', Price: 2.00, City: "Bangalore", Date: '2024-12-22' },
  { id: 5, Title: 'Fig', Price: 10.50, City: "Hyderabad" },
  { id: 6, Title: 'Apple Ice', Price: 100.12, City: "Jammu", Country: "India" }
];

function ProductList() {
  const [filterType, setFilterType] = useState('startsWith');
  const [dateFilterType, setDateFilterType] = useState('dateBefore');
  const [query, setQuery] = useState('');
const [dateValue, setDateValue] = useState('');
  const [products, setProducts] = useState([]);
  const [ordering, setOrdering] = useState({});
  const [expandedRow, setExpandedRow] = useState();

  useEffect(() => {
  let filtered = dummyData;
  if (query) {
    filtered = filtered.filter(item => {
      const value = item.Title?.toString().toLowerCase(); // 👈 default field "Title" or could be dynamic
      if (!value) return false;

      switch (filterType) {
        case "startsWith":
          return value.startsWith(query);
        case "endsWith":
          return value.endsWith(query);
        case "equals":
          return value === query;
        default:
          return false;
      }
    });
  }

  if (dateValue) {
    const selectedDate = new Date(dateValue);
    filtered = filtered.filter(item => {
      if (!item.Date) return false;
      const itemDate = new Date(item.Date);

      switch (dateFilterType) {
        case "dateBefore":
          return itemDate < selectedDate;
        case "dateAfter":
          return itemDate > selectedDate;
        case "dateOn":
          return itemDate.toISOString().split("T")[0] === dateValue;
        default:
          return false;
      }
    });
  }
  setProducts(filtered);
}, [query, dateValue, filterType, dateFilterType]);

  const testing = (order: 'asc' | 'desc', field: string) => {
    const sortedProducts = [...products].sort((a, b) => {
      const Avalue = a[field] ?? '';
      const Bvalue = b[field] ?? '';

      if (typeof a[field] === 'string') {
        return order === 'asc'
          ? Avalue.localeCompare(Bvalue)
          : Bvalue.localeCompare(Avalue);
      } else {
        return order === 'asc'
          ? Number(Avalue) - Number(Bvalue)
          : Number(Bvalue) - Number(Avalue);
      }
    });
    setOrdering({ [field]: order });
    setProducts(sortedProducts);
  };

  const dateTester = (e, field) => {
  const value = e.target.value;
  setDateValue(value);
  if (!value) {
    setProducts(dummyData);
    return;
  }

  const selectedDate = new Date(value); 

  const filtered = dummyData.filter(item => {
    if (!item.Date) return false;

    const itemDate = new Date(item.Date); 

    switch (dateFilterType) {
      case "dateBefore":
        return itemDate < selectedDate;
      case "dateAfter":
        return itemDate > selectedDate;
      case "dateOn":
        return itemDate.toISOString().split("T")[0] === value;
      default:
        return false;
    }
  });

  setProducts(filtered);
};

  const searchTester = (e, field) => {
    const search = e.target.value.toLowerCase();
    setQuery(search);

    const filtered = dummyData.filter(item => {
      const value = item[field]?.toString().toLowerCase();
      if (!value) return false;

      switch (filterType) {
        case "startsWith":
          return value.startsWith(search);
        case "endsWith":
          return value.endsWith(search);
        case "equals":
          return value === search;
        default:
          return false;
      }
    });

    setProducts(search.length === 0 ? dummyData : filtered);
  };

  const searchFilter = header => (
    <>
      <div>
        <label>Filter Type: </label>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
        >
          <option value="startsWith">Starts With</option>
          <option value="endsWith">Ends With</option>
          <option value="equals">Equals To</option>
        </select>
      </div>
      <div>
        <label>Search: </label>
        <input
          type="text"
          id={header}
          name={header}
          onChange={e => searchTester(e, header)}
        />
      </div>
    </>
  );

  const dateFilter = header => (
    <>
      <div>
        <label>Filter Type: </label>
        <select
          value={dateFilterType}
          onChange={e => setDateFilterType(e.target.value)}
        >
          <option value="dateBefore">Date Before</option>
          <option value="dateAfter">Date After</option>
          <option value="dateOn">on Date</option>
        </select>
      </div>
      <div>
        <label>Date: </label>
        <input
          type="date"
          id={header}
          name={header}
          onChange={e => dateTester(e, header)}
        />
      </div>
    </>
  );

  const headers = ['Exp/Col', 'Title', 'Date', 'Price', 'City', 'Country'];
  const extraFields = [...new Set(products.flatMap(product => Object.keys(product)))].filter(key => !headers.includes(key) && key !== "id");

  return (
    <div>
      <p className="text-3xl font-bold underline">Products List</p>
      <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        <table className="border-collapse border border-gray-400 w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  className="text-purple-600 border border-gray-300 p-4 bg-blue-gray-50"
                  key={index}
                >
                  {header}
                  {header !== "Exp/Col" && <>
                    <button onClick={() => testing('asc', header)}>
                      <img
                        src={down}
                        alt="Sort Asc"
                        className={`w-4 h-4 ${ordering[header] === 'asc' ? "opacity-100" : "opacity-40"}`}
                      />
                    </button>
                    <button onClick={() => testing('desc', header)}>
                      <img
                        src={up}
                        alt="Sort Desc"
                        className={`w-4 h-4 ${ordering[header] === 'desc' ? "opacity-100" : "opacity-40"}`}
                      />
                    </button>
                    {header === 'Date' ? dateFilter(header) :
                      searchFilter(header)
                    }
                  </>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((row) => {
                return (
                  <React.Fragment key={row.id}>
                    <tr>
                      {headers.map((header, colIndex) => (
                        <td key={colIndex} className="border border-gray-300 p-4">
                          <p className="block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900">
                            {header === "Price"
                              ? row[header]?.toFixed(3)
                              : header === "Exp/Col" ? '' : row[header] ?? "-"}
                            {header === "Exp/Col" && (
                              <button
                                className="ml-2 text-lg cursor-pointer text-blue-600"
                                type="button"
                                onClick={() =>
                                  setExpandedRow(expandedRow === row.id ? null : row.id)
                                }
                              >
                                {expandedRow === row.id ? "(Collapse)" : "(Expand)"}
                              </button>
                            )}
                          </p>
                        </td>
                      ))}
                    </tr>
                    {expandedRow === row.id && extraFields.length > 0 && (
                      <tr className="bg-gray-50">
                        <td colSpan={headers.length} className="border border-gray-300 p-4">
                          <table className="min-w-full border border-gray-300 rounded-lg">
                            <thead className="bg-gray-100">
                              <tr>
                                {extraFields.map(field => (
                                  <th key={field} className="px-4 py-2 border text-left">
                                    {field}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                {extraFields.map(field => (
                                  <td key={field} className="px-4 py-2 border">
                                    {row[field] ?? '-'}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>

                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={headers.length} className="text-center p-4">
                  No Product Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductList;
