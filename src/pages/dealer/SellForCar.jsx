/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useCarCountByStatusQuery, useDealerIdByCarQuery } from "../../services/carAPI";
import { Tooltip } from "@material-tailwind/react";
import { useEffect, useState } from "react";
 
import TableComponent from "../../components/table/TableComponent";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  Dialog,
  DialogFooter,
  DialogBody,
} from "@material-tailwind/react";
import { Link, useParams } from "react-router-dom";
import { useCarRemoveMutation } from "../../services/carAPI";
import { MdPendingActions } from "react-icons/md";
import StatusDialogeBox from "../../ui/StatusDialogeBox";
import { useCarUpdateMutation } from "../../services/carAPI";
import { FiLoader } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const SellForCar = () => {
  const [pageNo, setPageNo] = useState(0);
  const { id } = useParams();
  
  const [carRemove] = useCarRemoveMutation();
  const active = "ACTIVE";
  const pending = "PENDING";
  const sell = "SOLD";
  const deactive = "DEACTIVATE";
  const [selectedStatus, setSelectedStatus] = useState("ACTIVE");
  
  const {data : activeCounts , refetch : activeCountRefetch} = useCarCountByStatusQuery({status : active, id:id}) ;
  const {data : pendingCounts , refetch : pendingCountRefetch} = useCarCountByStatusQuery({status : pending,id :id}) ;
  const {data : deactivateCounts , refetch : deactiveCountRefetch} = useCarCountByStatusQuery({status : deactive,id :id}) ;
  const {data : soldCounts , refetch : soldCountsRefetch} = useCarCountByStatusQuery({status : sell,id:id}) ;
  const { data: activeData = [], isLoading: isLoadingActive, error: errorActive, refetch: refetchActive } = useDealerIdByCarQuery({ id, pageNo, status: active });
  const { data: pendingData = [], isLoading: isLoadingPending, error: errorPending ,refetch : pendingRefeatch } = useDealerIdByCarQuery({ id, pageNo, status: pending });
  const { data: sellData = [], isLoading: isLoadingSell, error: errorSell ,refetch :sellRefeatch } = useDealerIdByCarQuery({ id, pageNo, status: sell });
  const { data: deactiveData = [], isLoading: isLoadingDeactive, error: errorDeactive, refetch: refetchDeactive } = useDealerIdByCarQuery({ id, pageNo, status: deactive });

  // Example of using the data safely
  const activeItems = errorActive?.status === 404 ? [] : activeData?.list || [];
  const pendingItems = errorPending?.status === 404 ? [] : pendingData?.list || [];
  const sellItems = errorSell?.status === 404 ? [] : sellData?.list || [];
  const deactiveItems = errorDeactive?.status === 404 ? []: deactiveData?.list || [];
  
  const activeCount = activeCounts?.object;
  const pendingCount = pendingCounts?.object;
  const sellCount = soldCounts?.object;
  const deactiveCount = deactivateCounts?.object;

  const data =[];
  const activeCarsData = data?.list?.filter(car => car?.carStatus === "ACTIVE");

  const [totalCars, setTotalCars] = useState(activeCount || 0);
  const [activeCars, setActiveCars] = useState(activeCount || 0);
  const [pendingCars, setPendingCars] = useState(pendingCount || 0);
  const [inspectionDone, setInspectionDone] = useState(activeCount || 0);
  const [sellCars, setSellCars] = useState(sellCount || 0);
  const [deactiveCars, setdeactiveCars] = useState(deactiveCount || 0);

  const [open, setOpen] = useState(false);
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openActivate, setOpenActivate] = useState(false);
  const [deactivateId, setDeactivateId] = useState();
  const [deleteid, setDeleteid] = useState();
  const [list, setList] = useState([]);

  const [carUpdate] = useCarUpdateMutation(deactivateId);
  const [selectedOption, setSelectedOption] = useState(false); 

  const token = Cookies.get("token");

  let jwtDecodes;

  if (token) {
    jwtDecodes = jwtDecode(token);
  }


  const handleFilterCars = (data) => {
    setList(data?.list ?? []);
  }

  const statusDataMap = {
    active: data,
    pending: pendingData,
    sell: sellData,
    deactive: deactiveData
  };

  const handleFilterByStatus = (status) => {
    const data = statusDataMap[status];
    handleFilterCars(data);
  }
 
  const renderTable = () => {
    switch (selectedStatus) {
      case active:
        return activeItems.length > 0 ? (
          <TableComponent columns={columns} data={activeItems} className="border border-gray-200" />
        ) : (
          <p>No active cars available</p>
        );
      case pending:
        return pendingItems.length > 0 ? (
          <TableComponent columns={columns} data={pendingItems} className="border border-gray-200" />
        ) : (
          <p>No pending cars available</p>
        );
      case sell:
        return sellItems.length > 0 ? (
          <TableComponent columns={columns} data={sellItems} className="border border-gray-200" />
        ) : (
          <p>No sold cars available</p>
        );
      case deactive:
        return deactiveItems.length > 0 ? (
          <TableComponent columns={columns} data={deactiveItems} className="border border-gray-200" />
        ) : (
          <p>No deactivated cars available</p>
        );
      default:
        return null;
    }
  };
 
  const userRole = token ? jwtDecodes?.authorities[0] : null;

  const handleOpenDeactivate = (carId) => {
    setOpenDeactivate(!openDeactivate);
    setDeactivateId(carId);
  };
  const PertotalCars = Math.ceil((totalCars / totalCars) * 100);
  const perActive =  data ?  Math.floor((activeCars/totalCars)*100) : 0
  const perPending = Math.ceil((pendingCars / totalCars) * 100);
  const perSold = Math.floor((sellCars / totalCars) * 100);
  const perDeactive =deactiveData?  Math.floor((deactiveCars/totalCars)*100) : 0

  const handleOpenAactivate = (carId) => {
    setOpenActivate(!openActivate);
    setDeactivateId(carId);
  };

  const deactivateStatus = async () => {
    const data = {
      carStatus: "DEACTIVATE",
    };
    const res = await carUpdate({ data, carId: deactivateId });
    setSelectedOption("DEACTIVATE");
    refetchActive()
    pendingRefeatch(); 
    sellRefeatch();
    refetchDeactive();
    activeCountRefetch();
    pendingCountRefetch();
    soldCountsRefetch();
    deactiveCountRefetch();
    setOpenDeactivate(!openDeactivate);
  };

  const activateCarStatus = async () => {
    const data = {
      carStatus: "ACTIVE",
    };
    const res = await carUpdate({ data, carId: deactivateId });
    setSelectedOption("ACTIVE");
    refetchActive()
    pendingRefeatch(); 
    sellRefeatch();
    refetchDeactive();
    activeCountRefetch();
    pendingCountRefetch();
    soldCountsRefetch();
    deactiveCountRefetch();
    setOpenActivate(!openActivate);
  };

  const handleOpen = (carId) => {
    setOpen(!open);
    setDeleteid(carId);
  };

  const handleOpen1 = (carId) => {
    deleteDealerHandler(deleteid);
    setOpen(!open);
  };


  const deleteDealerHandler = async (carId) => {
    const res = await carRemove({ id, carId });
  };
  useEffect(() => {
    if (data || pendingData || sellData || deactiveData) {
      const totalCars = (activeCount ?? 0) + (pendingCount ?? 0) + (sellCount ?? 0) + (deactiveCount ?? 0);
      setTotalCars(totalCars);
      setActiveCars(activeCount || "-");
      setPendingCars(pendingCount || "-");
      setInspectionDone(activeCount || "-");
      setSellCars(sellCount || "-");
      setdeactiveCars(deactiveCount || "-");
      
    }
    if (data?.list?.length !== 0) {
      setList(data?.list);
    }else
     if (pendingData?.list?.length !== 0) {
      setList(pendingData?.list);
    } else if (activeCarsData?.list?.length !== 0) {
      setList(activeCarsData?.list);
    } else if (deactiveData?.list?.length !== 0) {
      setList(deactiveData.list);
    } else {
      // Optional: handle the case where none of the lists are available
      setList([]);
    }
 
  }, [data,pendingData,sellData,deactiveData]);
  const nextHandler = () => {
    setPageNo((prevPageNo) => {
      // Check if the error status is 404
      if (errorActive?.status === 404) {
        return prevPageNo; // Keep pageNo unchanged
      } else {
        // Increment pageNo
        return prevPageNo + 1;
      }
    });
  };

   
  const columns = [
    {
      Header: "Sr. No",
      accessor: "serialNumber",
      Cell: (cell) => {
        const { pageSize } = cell.state; // Assuming you're using React Table's useTable hook
        const serialNumber = pageNo * pageSize + cell.row.index + 1;
        return serialNumber;
      },
    },
    {
      Header: "Code",
      accessor: "mainCarId",
    },

    {
      Header: "ID",
      accessor: "carId",
    },

    {
      Header: "Brand ",
      accessor: "brand",
    },
    {
      Header: "Model ",
      accessor: "model",
    },
    {
      Header: "Fuel Type",
      accessor: "fuelType",
    },
    {
      Header: "Year",
      accessor: "year",
    },

    {
      Header: "Price",
      accessor: "price",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "carStatus",
      Cell: (cell) => {
        return (
          <div>
            <div className="flex gap-2 justify-center items-center  ">
              <StatusDialogeBox status={cell.row.values.carStatus} carId={cell.row.values.carId} refetchActive={refetchActive} pendingRefeatch={pendingRefeatch} sellRefeatch={sellRefeatch} refetchDeactive={refetchDeactive} activeCountRefetch={activeCountRefetch} pendingCountRefetch={pendingCountRefetch} soldCountsRefetch={soldCountsRefetch} deactiveCountRefetch={deactiveCountRefetch} />
            </div>
          </div>
        );
      },
    },

    {
      Header: "Action",
      accessor: "Edit",
      Cell: (cell) => {
        return (
          <div>
            <div className="flex gap-2 justify-center items-center  ">
              <Link to={`/carlist/cardetails/${cell.row.values.carId}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer"
                  color="blue"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                  />
                </svg>
              </Link>
                {userRole !== "ADMIN" ? 
                
              <Link to={`/dealer/${id}/car/edit/${cell.row.values.carId}`}>
                <svg
                  xmlns="http://www3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer"
                  color="green"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </Link> : null
              }

              {cell.row.values.carStatus == "ACTIVE" && (
                <Button
                  onClick={() => handleOpenDeactivate(cell.row.values.carId)}
                  color="red"
                  size="sm"
                  variant="outlined"
                >
                  Deactivate
                </Button>
              )}
              {cell.row.values.carStatus == "DEACTIVATE" && (
                <Button
                  onClick={() => handleOpenAactivate(cell.row.values.carId)}
                  color="green"
                  size="sm"
                  variant="outlined"
                >
                  Activate
                </Button>
              )}
            </div>
          </div>
        );
      },
    },
  ];
  
    
  let dealersCarData;
  if (isLoadingActive) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center p-8">
        <FiLoader className="animate-spin text-blue-gray-800 h-16 w-16" />
        <Typography className="mt-4 text-center">Loading data, please wait...</Typography>
      </div>
    );
  } else {
    dealersCarData = data?.list;
  }
  return (
    <div 
  style={{
    backgroundImage: "url('/CarsImages/pic.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    padding: "20px"
  }}
>
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        minHeight: "100vh",
        padding: "20px"
      }}>
     <div className="justify-center lg:grid lg:grid-cols-5 md:grid md:grid-cols-3">
        <div className="p-5">
          <Card className="w-full">
            <CardBody className="justify-center items-center">
              <Typography variant="h2" className="flex justify-center items-center font-bold">
                {totalCars}
              </Typography>
              <Typography className="flex justify-center items-center font-bold">
                Total Cars
              </Typography>
            </CardBody>
          </Card>
        </div>

        <div onClick={() => {setSelectedStatus(active);setPageNo(0);}} className="p-5">
          <Card className="w-full">
            <CardBody className="justify-center items-center">
              <Typography variant="h2" className="flex justify-center items-center font-bold" style={{color: "#28A745"}}>
                {activeCars}
              </Typography>
              <Typography className="flex justify-center items-center font-bold">
                Active Cars
              </Typography>
            </CardBody>
          </Card>
        </div>

        <div onClick={() => {setSelectedStatus(pending);setPageNo(0);}} className="p-5">
          <Card className="w-full">
            <CardBody className="justify-center items-center">
              <Typography variant="h2" className="flex justify-center items-center font-bold" style={{color: "#FFC107"}}>
                {pendingCars}
              </Typography>
              <Typography className="flex justify-center items-center font-bold">
                Pending Cars
              </Typography>
            </CardBody>
          </Card>
        </div>

        <div onClick={() => {setSelectedStatus(sell);setPageNo(0);}} className="p-5">
          <Card className="w-full">
            <CardBody className="justify-center items-center">
              <Typography variant="h2" className="flex justify-center items-center font-bold" style={{color: "#87CEEB"}}>
                {sellCars}
              </Typography>
              <Typography className="flex justify-center items-center font-bold">
                Sold Cars
              </Typography>
            </CardBody>
          </Card>
        </div>

        <div onClick={() => {setSelectedStatus(deactive);setPageNo(0);}} className="p-5">
          <Card className="w-full">
            <CardBody className="justify-center items-center">
              <Typography variant="h2" className="flex justify-center items-center font-bold" style={{color: "#FF0000"}}>
                {deactiveCars}
              </Typography>
              <Typography className="flex justify-center items-center font-bold">
                Deactive Cars
              </Typography>
            </CardBody>
          </Card>
        </div>
      </div>

      {errorActive?.status === 404 && list?.length === 0 ? (
        <div>
          <p>No Data Available</p>
          {userRole === "DEALER" ? (
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Link to={`/dealer/${id}/addcar`}>
                <Button color="indigo">Add Car</Button>
              </Link>
            </div>
          ) : (
            <p className="hover:text-blue-900"></p>
          )}
        </div>
      ) : (
        <div>
          <Card className="h-full w-full">
            <Dialog open={open} handler={handleOpen}>
              <DialogBody className="flex justify-center">
                <p className="font-semibold text-xl">
                  Are you sure want to delete?
                </p>
              </DialogBody>
              <DialogFooter className="flex justify-center">
                <Button
                  variant="text"
                  color="red"
                  onClick={handleOpen}
                  className="mr-1"
                >
                  <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="green" onClick={handleOpen1}>
                  <span>Confirm</span>
                </Button>
              </DialogFooter>
            </Dialog>
            <CardHeader floated={false} shadow={false} className="rounded-none">
  <div className="flex flex-col items-center w-full">
    <Typography variant="h4" color="blue-gray" className="text-center">
      Car Listing
    </Typography>
    <Typography color="gray" className="mt-1 font-normal text-center">
      See Information About All Cars
    </Typography>
  </div>

              <div className="overflow-scroll px-0">
                {isLoadingActive || isLoadingPending || isLoadingSell || isLoadingDeactive ? (
                  <p>Loading data...</p>
                ) : (
                  renderTable()
                )}
              </div>
            </CardHeader>
            {errorActive ? (
              <p className="text-center">car is not found</p>
            ) : (
              <div></div>
            )}

<CardFooter className="flex flex-col items-center border-t border-blue-gray-50 p-4">
{userRole === "DEALER" && (
    <div className="absolute right-4 bottom-4">
      <Link to={`/dealer/${id}/addcar`}>
        <Button color="indigo">Add Car</Button>
      </Link>
    </div>
  )}
  <div className="flex gap-2 items-center">
    <Button
      variant="outlined"
      size="sm"
      disabled={pageNo <= 0}
      onClick={() => setPageNo((a) => a - 1)}
    >
      Previous
    </Button>
    
    {Array.from({ length: Math.ceil(totalCars / 10) }).map((_, i) => {
      // Only show page number if it has data
      const hasData = (i * 10) < totalCars;
      return hasData && (
        <Button
          key={i}
          variant={pageNo === i ? "filled" : "outlined"}
          size="sm"
          onClick={() => setPageNo(i)}
          className="min-w-[40px]"
        >
          {i + 1}
        </Button>
      );
    })}

    <Button
      variant="outlined"
      size="sm"
      onClick={nextHandler}
      disabled={pageNo >= Math.ceil(totalCars / 10) - 1}
    >
      Next
    </Button>
  </div>
  <Typography color="blue-gray" className="font-normal mt-2">
    Page {pageNo + 1} of {Math.ceil(totalCars / 10)}
  </Typography>
</CardFooter>
          </Card>
        </div>
      )}

      {/* Deactivate Popup */}
      {openDeactivate && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-3">
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to deactivate?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={deactivateStatus}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Confirm
              </button>
              <button
                onClick={handleOpenDeactivate}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {openActivate && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to Activate?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={activateCarStatus}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Confirm
              </button>
              <button
                onClick={handleOpenAactivate}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SellForCar;
