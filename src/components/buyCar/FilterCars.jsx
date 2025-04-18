/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { Card } from "@material-tailwind/react";
import { Button, Typography } from "@material-tailwind/react";
import { FaFilter } from "react-icons/fa";
import Slider from "@mui/material/Slider";
import {
    Autocomplete,
    Checkbox,
    FormControlLabel,
    TextField,
} from "@mui/material";

// eslint-disable-next-line react/prop-types
import {
    useGetOnlyBrandsQuery,
    useGetVariantsQuery,
} from "../../services/brandAPI";
const FilterCars = ({ setUrlState }) => {
  const { data: brandData } = useGetOnlyBrandsQuery();
  const brands = brandData?.list.map((item) => item.brand) || [];

  const [selectedBrand, setSelectedBrand] = useState("");
  const [modelOptions, setModelOptions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [value, setValue] = useState([0, 6000000]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceError, setPriceError] = useState("");
  const [underTwoLakh, setUnderTwoLakh] = useState(false);
  const [twoLakhFiveLakh, setTwoLakhFiveLakh] = useState(false);
  const [fiveToEightLakh, setFiveToEightLakh] = useState(false);
  const [eightToTenLakh, setEightToTenLakh] = useState(false);
  const [aboveTenLakh, setAboveTenLakh] = useState(false);

  const { data: variantData } = useGetVariantsQuery(selectedBrand, {
    skip: !selectedBrand,
  });

  useEffect(() => {
    if (variantData) {
      const models = [...new Set(variantData.list.map((item) => item.variant))];
      setModelOptions(models);
    }
  }, [variantData]);

  const handleBrandChange = (event, newValue) => {
    const brand = newValue;
    setSelectedBrand(brand);
    setFilterForm({
      ...filterForm,
      brand,
      model: "",
    });
  };

  const handleModelChange = (event, newValue) => {
    const model = newValue;
    setFilterForm({
      ...filterForm,
      model,
    });
  };

  const [filterForm, setFilterForm] = useState({
    area: "",
    year: "",
    brand: "",
    model: "",
    fuelType: "",
    transmission: "",
    ownership: "",
  });

  const submitHandle = (e) => {
    e.preventDefault();
    const min = parseInt(minPrice.replace(/,/g, ""));
    const max = parseInt(maxPrice.replace(/,/g, ""));
    if (min > max) {
      alert("Minimum price cannot exceed maximum price.");
      return;
    }

    const url = {
      Area: filterForm.area,
      Year: filterForm.year,
      Brand: filterForm.brand.toUpperCase(),
      Model: filterForm.model,
      FuleType: filterForm.fuelType,
      Transmission: filterForm.transmission,
      MinPrice: minPrice,
      MaxPrice: maxPrice,
    };
    setUrlState(url);
  };

  const resetForm = () => {
    setMinPrice("");
    setMaxPrice("");
    setPriceError("");

    setSelectedBrand("");
    setModelOptions([]);
    setFilterForm({
      area: "",
      year: "",
      brand: "",
      model: "",
      fuelType: "",
      transmission: "",
    });
    setUrlState({
      area: "",
      year: "",
      brand: "",
      model: "",
      fuelType: "",
      transmission: "",
      MinPrice: "",
      MaxPrice: "",
    });
  };

  const AreaData = [
    { area: "Viman Nagar"},
    { area: "Koregaon Park"},
    { area: "Aundh"},
    { area: "Kothrud" },
    { area: "Hadapsar" },
    { area: "Shivajinagar" },
    { area: "Kalyani Nagar" },
    { area: "Pimpri-Chinchwad" },
    { area: "Magarpatta" },
    { area: "Wadgaon Sheri" },
    { area: "Katraj" },
    { area: "Model Colony" },
    { area: "Pune Cantonment" },
    { area: "Senapati Bapat Road" },
    { area: "Bhosari" },
    { area: "Chakan" },
    { area: "Bavdhan" },
    { area: "Hinjewadi" },
    { area: "Baner" },
    { area: "Kharadi" },
    { area: "Wagholi" },
  ];

  const Year = [
    { year: 2000 },
    { year: 2001 },
    { year: 2002 },
    { year: 2003 },
    { year: 2004 },
    { year: 2005 },
    { year: 2006 },
    { year: 2007 },
    { year: 2008 },
    { year: 2009 },
    { year: 2010 },
    { year: 2011 },
    { year: 2012 },
    { year: 2013 },
    { year: 2014 },
    { year: 2015 },
    { year: 2016 },
    { year: 2017 },
    { year: 2018 },
    { year: 2019 },
    { year: 2020 },
    { year: 2021 },
    { year: 2022 },
    { year: 2023 },
    { year: 2024 },
  ];

  const FuelType = [
    { fuelType: "Petrol" },
    { fuelType: "Diesel" },
    { fuelType: "Electric" },
    { fuelType: "CNG" },
    { fuelType: "Petrol+CNG" },
  ];

  const Transmission = [
    { transmission: "Automatic" },
    { transmission: "Manual" },
  ];

  const handlePriceChange = (e, isMin) => {
    const value = e.target.value.replace(/,/g, "");
    const numericValue = value.replace(/[^0-9]/g, "");
    const formattedValue = numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (isMin) {
      if (parseInt(numericValue) > 1000000) {
        setPriceError("Minimum amount should be in numbers between 1 and 20,00,000");
        
      } else {
        setPriceError("");
        setMinPrice(formattedValue);
      }
    } 
    else {
      const min = parseInt(minPrice.replace(/,/g, ""));
       if (parseInt(numericValue) > 2000000) {
        setPriceError("For high-budget cars, go to 'Premium Cars' section.");
      } else {
        setPriceError("");
        setMaxPrice(formattedValue);
      }
    }
  };

  return (
    <div>
      <div className="container mx-auto px-4">
        <div className="flex justify-end mb-6">
          <button
            type="button"
            className="text-black text-lg font-bold font-[latto] flex items-center bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="mr-2">
              <FaFilter />
            </span>
            Filter cars...
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <Card className="p-6 bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <p className="font-arial mb-7 text-2xl text-indigo-400 text-center">Filters...</p>

              <button
                className="text-black text-2xl mb-7"
                onClick={() => setShowFilters(false)}
              >
                &times;
              </button>
            </div>
                <div className="space-y-4">
                  <form onSubmit={submitHandle}>
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-lg">Sort by:</label>
                    <select className="border rounded p-2">
                      <option value="name">By Name (A-Z)</option>
                      <option value="price">By Price (Low to High)</option>
                    </select>
                  </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between">
                      <TextField
                        label="Enter Minimum Price"
                        type="text"
                        value={minPrice}
                        onChange={(e) => handlePriceChange(e, true)}
                        className="w-full"
                      />
                      <TextField
                        label="Enter Maximum Price"
                        type="text"
                        value={maxPrice}
                        onChange={(e) => handlePriceChange(e, false)}
                        className="w-full"
                      />
                    </div>
                    {priceError && <p className="text-red-500">{priceError}</p>}
                  </div>
                </div>
                <div>
                  <Autocomplete
                    id="area-autocomplete"
                    className="my-1"
                    freeSolo
                    options={AreaData}
                    getOptionLabel={(option) => option.area}
                    sx={{ width: "50%", background: "White" }}
                    value={filterForm.area ? { area: filterForm.area } : { area: "" }}
                    onInputChange={(event, newInputValue) => {
                      setFilterForm((prevForm) => ({
                        ...prevForm,
                        area: newInputValue,
                      }));
                    }}
                    onChange={(event, newValue) => {
                      setFilterForm((prevForm) => ({
                        ...prevForm,
                        area: newValue ? newValue.area : "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Select the Area" />
                    )}
                  />

                  <Autocomplete
                    id="year-autocomplete"
                    className="my-1"
                    freeSolo
                    options={Year}
                    getOptionLabel={(option) => option.year.toString()}
                    sx={{ width: "40%", background: "White" }}
                    value={filterForm.year ? { year: filterForm.year } : { year: "" }}
                    onInputChange={(event, newInputValue) => {
                      setFilterForm((prevForm) => ({
                        ...prevForm,
                        year: newInputValue,
                      }));
                    }}
                    onChange={(event, newValue) => {
                      setFilterForm((prevForm) => ({
                        ...prevForm,
                        year: newValue ? newValue.year : "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Select the Car Year" />
                    )}
                  />
                </div>
                <div>
                  <Autocomplete
                    id="brand-autocomplete"
                    className="my-1"
                    freeSolo
                    options={brands}
                    getOptionLabel={(option) => option}
                    sx={{ width: "50%", background: "White" }}
                    value={filterForm.brand}
                    onChange={handleBrandChange}
                    renderInput={(params) => (
                      <TextField {...params} label="Enter the Car-Brand" />
                    )}
                  />

                  <Autocomplete
                    id="model-autocomplete"
                    className="my-1"
                    freeSolo
                    options={modelOptions}
                    getOptionLabel={(option) => option}
                    sx={{ width: "45%", background: "White" }}
                    value={filterForm.model}
                    onChange={handleModelChange}
                    renderInput={(params) => (
                      <TextField {...params} label="Enter the Model of the car" />
                    )}
                  />
                </div>
                <div>
                  <Autocomplete
                    id="fueltype-autocomplete"
                    className="my-1"
                    freeSolo
                    options={FuelType}
                    getOptionLabel={(option) => option.fuelType}
                    sx={{ width: "40%", background: "White" }}
                    value={filterForm.fuelType ? { fuelType: filterForm.fuelType } : { fuelType: "" }}
                    onInputChange={(event, newInputValue) => {
                      setFilterForm((prevForm) => ({
                        ...prevForm,
                        fuelType: newInputValue,
                      }));
                    }}
                    onChange={(event, newValue) => {
                      setFilterForm((prevForm) => ({
                        ...prevForm,
                        fuelType: newValue ? newValue.fuelType : "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Select a Fuel Type" />
                    )}
                  />

                  <Autocomplete
                    id="transmission-autocomplete"
                    className="my-1"
                    freeSolo
                    options={Transmission}
                    getOptionLabel={(option) => option.transmission}
                    sx={{ width: "50%", background: "White" }}
                    value={filterForm.transmission ? { transmission: filterForm.transmission } : { transmission: "" }}
                    onInputChange={(event, newInputValue) => {
                      setFilterForm((prevForm) => ({
                        ...prevForm,
                        transmission: newInputValue,
                      }));
                    }}
                    onChange={(event, newValue) => {
                      setFilterForm((prevForm) => ({
                        ...prevForm,
                        transmission: newValue ? newValue.transmission : "",
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Select the Transmission of the Car" />
                    )}
                  />
                </div>
                <div className="flex gap-2 md:flex-col lg:flex">
                  <Button type="submit" className="bg-green-500 text-white text-sm">
                    Search
                  </Button>
                  <Button onClick={resetForm} className="bg-red-500 text-white text-sm">
                    Reset
                  </Button>
               </div>
               </form>
               </div>
          </Card>

        </div>
      )} 
    </div>
  );
};

FilterCars.propTypes = {
  setUrlState: PropTypes.func.isRequired, // Add prop validation
};

export default FilterCars;
