/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
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
import { FiLoader } from "react-icons/fi";
import Cookies from "js-cookie";

const SellForCarPremium = () => {
  const [pageNo, setPageNo] = useState(0);
  const { id } = useParams();
  
  const [open, setOpen] = useState(false);
  const [openDeactivate, setOpenDeactivate] = useState(false);
  const [openActivate, setOpenActivate] = useState(false);
  const [deactivateId, setDeactivateId] = useState();
  const [deleteid, setDeleteid] = useState();
  const [list, setList] = useState([]);

  const token = Cookies.get("token");
  let jwtDecodes;

  if (token) {
    jwtDecodes = jwtDecode(token);
  }

  const userRole = token ? jwtDecodes?.authorities[0] : null;

  const handleOpenDeactivate = (carId) => {
    setOpenDeactivate(!openDeactivate);
    setDeactivateId(carId);
  };

  const handleOpen = (carId) => {
    setOpen(!open);
    setDeleteid(carId);
  };

  const handleOpen1 = (carId) => {
    // Logic for deleting the car
    setOpen(!open);
  };

  const renderTable = () => {
    // Placeholder for rendering table data
    return <p>No data available</p>;
  };

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
                  {/* Placeholder for total cars */}
                  Total Cars
                </Typography>
              </CardBody>
            </Card>
          </div>

          {/* Other status cards */}
          <div className="p-5">
            <Card className="w-full">
              <CardBody className="justify-center items-center">
                <Typography variant="h2" className="flex justify-center items-center font-bold" style={{color: "#28A745"}}>
                  {/* Placeholder for active cars */}
                  Active Cars
                </Typography>
              </CardBody>
            </Card>
          </div>

          {/* Additional cards for Pending, Sold, Deactivated Cars */}
        </div>

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
                {/* Placeholder for loading state */}
                <p>Loading data...</p>
              </div>
            </CardHeader>
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
                {/* Placeholder for pagination */}
                <Button variant="outlined" size="sm" onClick={() => setPageNo((a) => a + 1)}>
                  Next
                </Button>
              </div>
              <Typography color="blue-gray" className="font-normal mt-2">
                Page {/* Placeholder for current page number */}
              </Typography>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellForCarPremium;
