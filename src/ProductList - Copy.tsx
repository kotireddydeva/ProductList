import React, { useState, useEffect } from 'react';
import down from './arrow-down-short.svg';
import up from './arrow-up-short.svg';

const dummyData = [
  { id: 1, Title: 'Banana', Price: 0.50, City: "Hyderabad"},
  { id: 2, Title: 'Apple', Price: 1.1214, City: "Pune", Country: "India"},
  { id: 3, Title: 'Orange', Price: 0.980, City: "Chennai"},
  { id: 4, Title: 'Mango', Price: 2.00, City: "Bangalore"},
  { id: 5, Title: 'Fig', Price: 10.50, City: "Hyderabad"},
  { id: 6, Title: 'Apple Ice', Price: 100.12, City: "Jammu", Country: "India"}
];

function ProductList() {
  const [filterType, setFilterType] = useState('startsWith');
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [ordering, setOrdering] = useState({});
  const [showMore, setShowMore] = useState()
  //const [sortDirection, setSortDirection] = useState('asc'); // 'asc' for ascending, 'desc' for descending

  useEffect(() => {
    setProducts(dummyData);
  }, []);

  const testing = (order, field) => {
    const sortedProducts = [...products].sort((a, b) => {
      const Avalue = a[field] ?? ''
      const Bvalue = b[field] ?? ''

      if (typeof a[field] === 'string') {
        // If the field is a string, use localeCompare
        return order === 'asc'
          ? Avalue.localeCompare(Bvalue)
          : Bvalue.localeCompare(Avalue);
      } else {
        // If the field is a number (e.g., price), do numeric comparison
        return order === 'asc'
          ? Avalue - Bvalue
          : Bvalue - Avalue;
      }
    });
    setOrdering({ [field]: order });
    setProducts(sortedProducts);
    console.log(ordering)
  };

  const tester = (e, field) => {

    const search = e.target.value.toLowerCase();
    setQuery(search);

    const filtered = products.filter(item => {
      const value = item[field]?.toString().toLowerCase();

      if (!value) return false;

      switch (filterType) {
        case 'startsWith':

          return value.startsWith(search);
        case 'endsWith':
          return value.endsWith(search);
        case 'equals':
          return value === search;
        default:
          return false;
      }
    });

    if (search.length === 0) {
      setProducts(dummyData);
    } else {
      setProducts(filtered);
    }

  };


  //const headers = products.length > 0 ? Object.keys(products[0]).slice(1) : [];
  const headers = ['Title', 'Price', 'City', 'Country']
  const innerHeaders = [...new Set(products.flatMap(product => Object.keys(product)))].filter(key => (key !== 'id' || key !== 'Title' ));
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
                      type="text" id={header} name={header} onChange={e => tester(e, header)}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ?

              products.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header, colIndex) => (
                    <td key={colIndex} className="border border-gray-300 p-4">
                      <p className="block font-sans text-sm antialiased font-bold leading-normal text-blue-gray-900">
                        {header === "Price"
                          ? row[header].toFixed(3)
                          : row[header]}
                          {header === "Title" && <button className='text-lg cursor-pointer' type='button' onClick={() => setShowMore(prev => !prev)}> {showMore ? '-' : '+'}</button>}
                      </p>

                    </td>
                  ))}
                </tr>
              )) : <tr>
                <td colSpan={headers.length} className="text-center p-4">
                  No Product Found
                </td>
              </tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductList;