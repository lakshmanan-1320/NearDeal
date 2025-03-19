import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { toast } from "react-toastify";

const CreateTable = ({ colNo, sendDataToParent,passData  }) => {
  const [columns, setColumns] = useState(["Name","Hours","Price"]);
  const [generating, setGenerating] = useState(true);
  const [readOnly, setReadOnly] = useState(true);
  const [rows, setRows] = useState(0);
  const [rowsData, setRowsData] = useState([]);
  const [modified, setModified] = useState(false);

  const handleChange = (e, index, index2) => {
    setRowsData((prevRowsData) => {
      const updatedRowsData = prevRowsData.map((rw, i) =>
          i === index ? rw.map((r, j) => (j === index2 ? e : r)) : rw
      );

      sendDataToParent(updatedRowsData); // Send the updated state
      console.log(updatedRowsData); // Log the latest state

      return updatedRowsData; // Ensure state is updated correctly
  });

  };

  const addRow = () => {
    setModified(true);
    setRows((prevRows) => prevRows + 1);
    let array = [""];
    for (let i = 1; i < columns.length; i++) {
      array.push("");
    }
    setRowsData((prevRowsData) => {
      const updatedRowsData = [...prevRowsData, array];
      sendDataToParent(updatedRowsData); // Send the latest updated data
      return updatedRowsData; // Ensure state is updated correctly
  });

    // console.log(rowsData);
  };

  const deleteRow = (index) => {
    setModified(true);
    setRows((prevRows) => prevRows - 1);
    setRowsData((prevRowsData) => prevRowsData.filter((row, i) => i !== index));
  };

  // const addColumn = () => {
  //   setModified(true);
  //   if (columns.length === 10) {
  //     return toast.dark("You can add max. 10 columns!");
  //   }
  //   setColumns((prevColumns) => [
  //     ...prevColumns,
  //     `Column ${columns.length + 1}`,
  //   ]);

  //   setRowsData((prevRowsData) =>
  //     prevRowsData.map((row) => row.push("") && row)
  //   );
  // };
  const deleteColumn = (index) => {
    setModified(true);
    if (columns.length === 1) {
      return toast.dark("There Should be atleast 1 column!");
    }
    setColumns((prevColumns) =>
      prevColumns.filter((col) => prevColumns.indexOf(col) !== index)
    );

    setRowsData((prevRowsData) =>
      prevRowsData.map((row) => {
        const filteredRows = row.filter((rw, i) => i !== index);
        return filteredRows;
      })
    );
  };

  const exportToJson = () => {
    const data = [];

    rowsData.map((row, index) => {
      const obj = { sno: index + 1 };
      columns.map((col, i) => {
        obj[col] = row[i];
      });
      data.push(obj);
    });

    const fileData = JSON.stringify(data);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `data.json`;
    link.href = url;
    link.click();
  };

  useEffect(() => {
    if (columns.length < colNo && !modified) {
      for (let i = 1; i < colNo; i++) {
        setColumns([...columns, `Column ${i + 1}`]);
      }
    }
    setGenerating(false);
  }, []);
  useEffect(() => {
    setRowsData(passData);
    console.log("passsss"+passData);
  });
  // useEffect(() => {
  //   sendDataToParent(rowsData);
  // }, [rowsData, sendDataToParent]);

  return (
    <Container fluid>
      <Row className="mt-2 mb-3">
        {/* <Col md={3}>
          <h5 className="text-center">Create Table</h5>
        </Col> */}

      </Row>
      <Row>
        <Col md={12} className="">
          {!generating ? (
            <>
              <Table responsive className="mb-5 h-100">
                {/* <thead>
                  <tr>
                    <th></th>

                    <th></th>
                  </tr>
                  <tr className="text-white">
                    <th
                      scope="col"
                      className="d-flex align-items-center justify-content-center py-3 pb-2 border-0"
                    >
                      Sno.
                    </th>
                    {columns.map((col, index) => (
                      <th key={index} scope="col">
                        <input
                          type="text"
                          className="form-control border-0 text-center bg-dark text-white"
                          style={{ outline: "none", boxShadow: "none" }}
                          readOnly={readOnly}
                          onFocus={() => setReadOnly(false)}
                          onBlur={() => setReadOnly(true)}
                          value={columns[index]}
                          onChange={(e) =>
                            setColumns(
                              columns.map((coln, id) =>
                                id === index ? e.target.value : coln
                              )
                            )
                          }
                        />
                      </th>
                    ))}
                  </tr>
                </thead> */}
                <tbody>
                  {rowsData.length > 0 ? (
                    <>
                      {rowsData.map((data, index) => (
                        <tr key={index + 5}>
                          {/* <td className="text-center">{index + 1}</td> */}
                          {/* {data.map((row, index2) => ( */}
                            <td key={1 + 988} style={{width:"16%"}}>
                              <input
                                type="text"
                                className="form-control text-center"
                                // style={{width:"50%"}}
                                placeholder={`Enter field`}
                                value={rowsData[index][0]}
                                onChange={(e) =>
                                  handleChange(e.target.value, index, 0)
                                }
                              />
                            </td>
                            <td key={2 + 988} style={{width:"8%"}}>
                              <input
                                type="text"
                                className="form-control text-center"
                                // style={{width:"50%"}}
                                placeholder={`Enter field`}
                                value={rowsData[index][1]}
                                onChange={(e) =>
                                  handleChange(e.target.value, index, 1)
                                }
                              />
                            </td>
                            <td key={3 + 988} style={{width:"8%"}}>
                              <input
                                type="text"
                                className="form-control text-center"
                                // style={{width:"50%"}}
                                placeholder={`Enter field`}
                                value={rowsData[index][2]}
                                onChange={(e) =>
                                  handleChange(e.target.value, index, 2)
                                }
                              />
                            </td>
                          {/* ))} */}
                          <td className="" style={{width:"20%"}}>
                            <Button
                              type="button"
                              onClick={() => deleteRow(index)}
                              variant={"outline-danger"}
                              size="sm"
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}

                      <tr className="">
                        <th colSpan={columns.length + 2} className="pt-5">
                          <Button
                            type="button"
                            onClick={addRow}
                            className="w-20"
                            variant="outline-dark"
                          >
                            Add New Service
                          </Button>
                        </th>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <th
                          className="text-center py-3"
                          colSpan={columns.length + 2}
                        >
                          Please click on Add Service
                        </th>
                      </tr>
                      <tr>
                        <th colSpan={columns.length + 2}>
                          <Button
                            type="button"
                            onClick={addRow}
                            className="w-20"
                            variant="outline-dark"
                          >
                            Add New Service
                          </Button>
                        </th>
                      </tr>
                    </>
                  )}
                </tbody>
              </Table>
            </>
          ) : (
            <h1 className="text-center my-5">Generating...</h1>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default CreateTable;