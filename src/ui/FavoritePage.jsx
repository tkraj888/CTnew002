/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetbyUserCarIdQuery } from "../services/carAPI";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import FavCard from "./FavCard";
import { fetchFavoriteCars } from "../pages/favoritesSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiLoader } from 'react-icons/fi';

export function FavoritePage() {
  const dispatch = useDispatch();
  const favoriteCars = useSelector(state => state.favorites.favoriteCars);
  const token = Cookies.get("token");
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();

  let jwtDecodes;
  if (token) {
    jwtDecodes = jwtDecode(token);
  }
  const UserId = jwtDecodes?.userId;

  const {
    data: userCars,
    error,
    isLoading,
    refetch
  } = useGetbyUserCarIdQuery({ UserId });

  useEffect(() => {
    if (UserId) {
      dispatch(fetchFavoriteCars(UserId));
      setLoader(false);
    }
  }, [dispatch, UserId]);

  if (loader) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-gray-50">
        <FiLoader className="animate-spin text-blue-600 h-16 w-16" />
      </div>
    );
  }

  if (error?.status === 401) {
    navigate("/signin");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="text-center text-4xl font-extrabold text-blue-900 mb-8">
        Favorite Cars
      </div>

      {favoriteCars && favoriteCars.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto max-w-7xl">
          {favoriteCars.map((data, key) => (
            <FavCard favoriteCarData={data} key={key} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-lg mt-10">
          You dont have any favorite cars yet.
        </div>
      )}
    </div>
  );
}