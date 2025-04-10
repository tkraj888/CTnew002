/* eslint-disable react/prop-types */

import { Card, Typography } from "@material-tailwind/react";

export default function DefaultTable({ TABLE_HEAD, TABLE_ROWS }) {
  return (
    <Card className="h-full w-full overflow-auto shadow-lg rounded-lg border border-gray-200">
      <table className="w-full min-w-max table-auto text-left bg-white rounded-lg">
        <thead className="sticky top-0 z-10">
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-4 text-sm font-semibold tracking-wide text-center"
              >
                <Typography
                  variant="small"
                  color="white"
                  className="font-normal leading-none"
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map(
            (
              { firstName, lastName, email, mobileno, city, address },
              index
            ) => {
              const isLast = index === TABLE_ROWS.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-gray-200";
              const rowBg = index % 2 === 0 ? "bg-gray-50" : "bg-white";

              return (
                <tr
                  key={firstName}
                  className={`${rowBg} hover:bg-blue-50 transition duration-150`}
                >
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {firstName}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {lastName}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {email}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {mobileno}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {city}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      {address}
                    </Typography>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </Card>
  );
}
