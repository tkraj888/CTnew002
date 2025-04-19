/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import FilterCars from "../components/buyCar/FilterCars";
import GridCarList from "../components/buyCar/GridCarList";
import { useFilterCarQuery, useGetbyUserCarIdQuery } from "../services/carAPI";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoriteCars } from "./favoritesSlice";

import { FiLoader } from 'react-icons/fi';

const BuyCar = () => {
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const [urlState, setUrllState] = useState(null);

  const emptyImage = "..\\..\\cars\\emptyfolder.png";

  const { data, isLoading, error, refetch } = useFilterCarQuery(urlState);
  let jwtDecodes;
  if (token) {
    jwtDecodes = jwtDecode(token);
  }
  const UserId = jwtDecodes?.userId;
  const navigate = useNavigate();

  useEffect(() => {
    if (UserId) {
      dispatch(fetchFavoriteCars(UserId)); // dispatch the thunk function itself
    }
  }, [dispatch, UserId]);


  if (error?.status === 401) {
    Cookies.remove("token");
    navigate("/signin");
  }
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center p-8">
        <FiLoader className="animate-spin text-blue-gray-800 h-16 w-16" />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto mt-12 px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-5xl font-bold text-left">Buy or Test-Drive a Car...</h2>
          <FilterCars setUrlState={setUrllState} onFilterChange={refetch} />
        </div>
        <div className="flex flex-wrap gap-6">
          {error?.status === 404 ? (
            <div className="w-full">
              <div className="flex justify-center mt-14">
                <img
                  className="w-40"
                  src={emptyImage}
                  alt="no data"
                />
              </div>
              <p className="flex justify-center text-2xl md:text-3xl font-semibold">No Data Available</p>
            </div>
          ) : (
            <GridCarList data={data} error={error} refetch={refetch} />
          )}
        </div>
      </div>
    </>
  );
};

export default BuyCar;
