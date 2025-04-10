/* eslint-disable react/prop-types */
// TableComponent.js
import React, { useMemo } from "react";
import { Typography } from "@material-tailwind/react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";

const TableComponent = ({ columns, data }) => {
  const { getTableProps, getTableBodyProps, headerGroups, page, prepareRow } =
    useTable(
      {
        columns,
        data,
        initialState: {
          hiddenColumns: [
            "biddingTimerId",
            "dealer_id",
            "salesPersonId",
            "brandDataId",
            "beadingCarId",
            "carId",
            "userId",
            "bidCarId",
            "biddingTimerStatus",
            "userFormId",
          ],
        },
      },
      useGlobalFilter,
      useSortBy,
      usePagination
    );

  const renderHeader = useMemo(() => {
    return headerGroups.map((headerGroup, index) => (
      <tr key={index} {...headerGroup.getHeaderGroupProps()}>
        {headerGroup.headers.map((column, index) => (
          <th
            key={index}
            {...column.getHeaderProps(column.getSortByToggleProps())}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white sticky top-0 z-10 p-4 text-sm font-semibold tracking-wide text-center"
          >
            {column.render("Header")}
            {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
          </th>
        ))}
      </tr>
    ));
  }, [headerGroups]);

  const renderRows = useMemo(() => {
    return page.map((row, index) => {
      prepareRow(row);
      return (
        <tr
          {...row.getRowProps()}
          key={index}
          className="hover:bg-gray-100 even:bg-gray-50 transition duration-200"
        >
          {row.cells.map((cell, i) => (
            <td
              key={i}
              {...cell.getCellProps()}
              className="p-4 border-b border-gray-200"
            >
              <Typography color="blue-gray" className="text-sm font-medium">
                {cell.render("Cell")}
              </Typography>
            </td>
          ))}
        </tr>
      );
    });
  }, [page, prepareRow]);

  if (!data) return null;

  return (
    <div className="h-full w-full overflow-auto">
      <div className="shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <table
          {...getTableProps()}
          className="w-full table-auto text-center bg-white"
        >
          <thead className="text-white">{renderHeader}</thead>
          <tbody {...getTableBodyProps()}>{renderRows}</tbody>
        </table>
      </div>
    </div>
  );
};

const MemoizedTableComponent = React.memo(TableComponent);
MemoizedTableComponent.displayName = "TableComponent";

export default MemoizedTableComponent;
