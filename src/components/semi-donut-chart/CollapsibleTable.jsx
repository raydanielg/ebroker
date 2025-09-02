import React, { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { formatPriceAbbreviated } from "@/utils/helperFunction";
import { useTranslation } from "../context/TranslationContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CollapsibleTable = ({ data }) => {
  const t = useTranslation();
  const [expandedRows, setExpandedRows] = useState({});
  const toggleRow = (rowId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [rowId]: !prev[rowId],
    }));
  };

  const columns = [
    {
      header: "#",
      accessor: "id",
      align: "center",
      className: "w-[5%]",
    },
    {
      header: t("year"),
      accessor: "year",
      align: "left",
      className: "w-[25%]",
    },
    {
      header: t("PrincipalAmount"),
      accessor: "principal_amount",
      align: "left",
      className: "w-[25%]",
    },
    {
      header: t("InterestPayable"),
      accessor: "interest_paid",
      align: "left",
      className: "w-[25%]",
    },
    {
      header: t("outstandingBalance"),
      accessor: "remaining_balance",
      align: "left",
      className: "w-[20%]",
    },
  ];

  // Function to get alignment class based on column alignment
  const getAlignmentClass = (align) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-center";
    }
  };

  if (!data?.length) return null;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <Table>
        <TableHeader className="bg-gray-800 font-medium text-white">
          <TableRow className="hover:bg-gray-800">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={`px-3 py-4 text-sm font-bold text-white ltr:first:rounded-tl ${getAlignmentClass(column.align)} ${column.className || ""}`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <TableRow
                className={`cursor-pointer transition-colors ${expandedRows[rowIndex] ? "bg-gray-50" : "hover:bg-gray-50"}`}
                onClick={() => toggleRow(rowIndex)}
              >
                <TableCell
                  className={`${getAlignmentClass("center")} ${columns[0].className || ""}`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRow(rowIndex);
                    }}
                    className="rounded-full p-1 transition-colors hover:bg-gray-100"
                    aria-label={
                      expandedRows[rowIndex] ? "Collapse row" : "Expand row"
                    }
                    tabIndex="0"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleRow(rowIndex);
                      }
                    }}
                  >
                    {expandedRows?.[rowIndex] ? (
                      <FaMinus className="h-5 w-5 rounded-full bg-primary p-[2px] text-white" />
                    ) : (
                      <FaPlus className="h-5 w-5 rounded-full bg-primary p-[2px] text-white" />
                    )}
                  </button>
                </TableCell>
                <TableCell
                  className={`secondryTextColor text-base font-medium ${getAlignmentClass("left")} ${columns[1].className || ""}`}
                >
                  {row.year}
                </TableCell>
                <TableCell
                  className={`secondryTextColor text-base font-medium ${getAlignmentClass("left")} ${columns[2].className || ""}`}
                >
                  {formatPriceAbbreviated(row.principal_amount)}
                </TableCell>
                <TableCell
                  className={`secondryTextColor text-base font-medium ${getAlignmentClass("left")} ${columns[3].className || ""}`}
                >
                  {formatPriceAbbreviated(row.interest_paid)}
                </TableCell>
                <TableCell
                  className={`secondryTextColor text-base font-medium ${getAlignmentClass("left")} ${columns[4].className || ""}`}
                >
                  {formatPriceAbbreviated(row.remaining_balance)}
                </TableCell>
              </TableRow>

              {/* Expanded content row */}
              {expandedRows[rowIndex] && row.monthly_totals?.length > 0 && (
                <TableRow className="bg-gray-50">
                  <TableCell
                    colSpan={columns.length}
                    className="border-t-0 p-0"
                  >
                    <div className="overflow-hidden transition-all duration-300">
                      <table className="w-full">
                        <tbody>
                          {row.monthly_totals.map((monthData, monthIndex) => (
                            <tr
                              key={monthIndex}
                              className="border-t border-gray-100 hover:bg-gray-50"
                            >
                              <td className="w-[5%] py-2"></td>
                              <td className="secondryTextColor w-[25%] py-2 pl-4 text-center text-base font-medium capitalize">
                                {t(monthData?.month?.toString().toLowerCase())}
                              </td>
                              <td className="secondryTextColor w-[25%] py-2 text-center text-base font-medium">
                                {formatPriceAbbreviated(
                                  monthData?.principal_amount,
                                )}
                              </td>
                              <td className="secondryTextColor w-[25%] py-2 text-center text-base font-medium">
                                {formatPriceAbbreviated(
                                  monthData?.payable_interest,
                                )}
                              </td>
                              <td className="secondryTextColor w-[20%] py-2 text-center text-base font-medium">
                                {formatPriceAbbreviated(
                                  monthData?.remaining_balance,
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CollapsibleTable;
