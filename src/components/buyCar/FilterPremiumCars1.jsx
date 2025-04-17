import { useEffect, useState, useCallback } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl,
  Slider,
  Grid,
  Chip,
  CircularProgress,
} from '@mui/material';

const FilterPremiumCars1 = () => {
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    area: '',
    year: '',
    fuelType: '',
    transmission: '',
    minPrice: 0,
    maxPrice: 10000000,
  });

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(
        Object.entries(filters).filter(([, v]) => v !== '')
      ).toString();

      const res = await fetch(`/premiumCars/mainFilter?${params}`);
      const data = await res.json();
      setCars(data.list || []);
    } catch (err) {
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (_, newValue) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: newValue[0],
      maxPrice: newValue[1],
    }));
  };

  const resetFilters = () => {
    setFilters({
      brand: '',
      model: '',
      area: '',
      year: '',
      fuelType: '',
      transmission: '',
      minPrice: 0,
      maxPrice: 10000000,
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">🚘 Filter Premium Cars</h2>

      <Grid container spacing={2} className="mb-6">
        {[
          { label: 'Brand', field: 'brand', options: ['audi', 'mercedies', 'bmw'] },
          { label: 'Model', field: 'model' },
          { label: 'Area', field: 'area', options:['kharadi', 'Hadapsar', 'Wagholi']},
          { label: 'Year', field: 'year', options:['2017','2018','2019','2020','2021','2022','2023','2024','2025'] },
          { label: 'Fuel Type', field: 'fuelType', options: ['Petrol', 'Diesel', 'Electric'] },
          { label: 'Transmission', field: 'transmission', options: ['Manual', 'Automatic'] },
        ].map(({ label, field, options }) => (
          <Grid item xs={12} sm={6} md={4} key={field}>
            {options ? (
              <FormControl fullWidth>
                <InputLabel>{label}</InputLabel>
                <Select
                  value={filters[field]}
                  label={label}
                  onChange={(e) => handleChange(field, e.target.value)}
                >
                  {options.map((opt) => (
                    <MenuItem value={opt} key={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                label={label}
                value={filters[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                fullWidth
              />
            )}
          </Grid>
        ))}

        <Grid item xs={12} className="px-4 mt-4">
          <h4 className="mb-2 font-semibold text-gray-700">💰 Price Range (₹)</h4>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onChange={handlePriceChange}
            min={1500000}
            max={10000000}
            step={50000}
            valueLabelDisplay="auto"
          />
        </Grid>

        <Grid item xs={12} className="flex gap-4 justify-center mt-4">
          <Button
            variant="contained"
            color="primary"
            onClick={fetchCars}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Apply Filters
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={resetFilters}
            className="hover:bg-gray-200"
          >
            Reset
          </Button>
        </Grid>
      </Grid>

      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        🔍 {cars.length} Cars Found
      </h3>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div
              key={car.premiumCarId}
              className="bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              <h4 className="text-lg font-bold mb-2 text-indigo-700">{car.title}</h4>
              <p className="text-sm text-gray-600">Brand: {car.brand}</p>
              <p className="text-sm text-gray-600">Model: {car.model}</p>
              <p className="text-sm text-gray-600">Year: {car.year}</p>
              <p className="text-sm text-gray-600">Price: ₹{car.price.toLocaleString()}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                <Chip label={car.fuelType} size="small" />
                <Chip label={car.transmission} size="small" />
                <Chip label={car.area} size="small" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterPremiumCars1;
