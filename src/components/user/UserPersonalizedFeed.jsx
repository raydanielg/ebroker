import {
  getCategoriesApi,
  getFacilitiesApi,
  submitUserInterestsApi,
  getUserIntrestedDataApi,
  deleteUserIntrestedDataApi,
} from "@/api/apiRoutes";
import { useEffect, useRef, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useTranslation } from "../context/TranslationContext";
import { Autocomplete } from "@react-google-maps/api";
import { Input } from "../ui/input";
import { useSelector } from "react-redux";
import useGoogleMapsError from "@/hooks/useGoogleMapsError";
import { Slider } from "@/components/ui/slider";
import { isRTL } from "@/utils/helperFunction";

const UserPersonalizedFeed = () => {
  const t = useTranslation();
  const autocompleteRef = useRef(null);
  const isRtl = isRTL()

  const systemSettings = useSelector((state) => state?.WebSetting?.data);
  const language = useSelector((state) => state.LanguageSettings?.active_language);
  const currency = systemSettings?.currency_symbol;
  const defaultMaxPrice = systemSettings?.max_price
    ? systemSettings?.max_price
    : "";
  const defaultMinPrice = systemSettings?.min_price
    ? systemSettings?.min_price
    : "";
  // State for selected interests and places
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [priceRange, setPriceRange] = useState([
    defaultMinPrice,
    defaultMaxPrice,
  ]);
  const [minPrice, setMinPrice] = useState(defaultMinPrice);
  const [maxPrice, setMaxPrice] = useState(defaultMaxPrice);
  const [location, setLocation] = useState({
    city: "",
    state: "",
    country: "",
    latitude: "",
    longitude: "",
    formattedAddress: "",
  });
  const [propertyType, setPropertyType] = useState("");
  // New state for listing type (All, Sell, Rent)
  const [listingType, setListingType] = useState("all");

  const [loadCategories, setLoadCategories] = useState(true);
  const [categories, setCategories] = useState([]);

  const [loadFacilities, setLoadFacilities] = useState(true);
  const [facilities, setFacilities] = useState([]);

  const [mapError, setMapError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  const { error: loadError, loading: isLoading } = useGoogleMapsError();

  // Fetch user's saved interests when component mounts
  useEffect(() => {
    fetchUserInterests();
  }, [language]);

  const fetchUserInterests = async () => {
    try {
      const response = await getUserIntrestedDataApi();

      if (response.error === false && response.data) {
        const userData = response.data;

        // Set saved values if they exist - convert from array strings to numbers
        if (userData.category_ids && userData.category_ids.length > 0) {
          // Convert string IDs to numbers if needed
          const categoryIds = userData.category_ids.map((id) => Number(id));
          setSelectedInterests(categoryIds);
        }

        if (
          userData.outdoor_facilitiy_ids &&
          userData.outdoor_facilitiy_ids.length > 0
        ) {
          // Convert string IDs to numbers if needed
          const facilityIds = userData.outdoor_facilitiy_ids.map((id) =>
            Number(id),
          );
          setSelectedPlaces(facilityIds);
        }

        if (userData.price_range && userData.price_range.length >= 2) {
          const minValue = Number(userData.price_range[0]);
          const maxValue = Number(userData.price_range[1]);

          setMinPrice(minValue);
          setMaxPrice(maxValue);
          setPriceRange([minValue, maxValue]);
        }

        if (userData.property_type !== undefined) {
          // Map API values back to our listing type values
          let listingTypeValue = "all";
          if (userData.property_type[0] === "0") {
            listingTypeValue = "sell";
          } else if (userData.property_type[0] === "1") {
            listingTypeValue = "rent";
          }
          setListingType(listingTypeValue);
        }

        if (userData.city) {
          setLocation((prev) => ({
            ...prev,
            city: userData.city,
            formattedAddress: userData.city,
          }));
        }

        setDataFetched(true);
        toast.success(
          t(response?.message),
        );
      }
    } catch (error) {
      console.error("Error fetching user interests:", error);
      toast.error(
        t("errorFetchingInterests") || "Failed to load your preferences",
      );
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadCategories(true);
      const response = await getCategoriesApi({
        limit: 100,
        offset: 0,
      });
      if (response.error === false) {
        setCategories(response?.data);
      }
      setLoadCategories(false);
    } catch (error) {
      console.error(error);
      setLoadCategories(false);
    }
  };

  const fetchFacilities = async () => {
    try {
      setLoadFacilities(true);
      const response = await getFacilitiesApi();
      if (response.error === false) {
        setFacilities(response?.data);
      }
      setLoadFacilities(false);
    } catch (error) {
      console.error(error);
      setLoadFacilities(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFacilities();
  }, [language]);

  useEffect(() => {
    if (loadError) {
      console.error("Google Maps Load Error:", loadError);
      setMapError(true);
      toast.error(t("googleMapsError"));
    }
  }, [loadError]);

  // Toggle interest selection
  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((item) => item !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // Toggle place selection
  const togglePlace = (id) => {
    if (selectedPlaces.includes(id)) {
      setSelectedPlaces(selectedPlaces.filter((item) => item !== id));
    } else {
      setSelectedPlaces([...selectedPlaces, id]);
    }
  };

  // Handle min price input with validation
  const handleMinPriceChange = (e) => {
    const value = e.target.value;
    // Only allow digits
    if (value === "" || /^\d+$/.test(value)) {
      const numValue = value === "" ? 0 : parseInt(value);
      setMinPrice(numValue);
      // Update price range slider min value
      setPriceRange([numValue, priceRange[1]]);
    }
  };

  // Handle max price input with validation
  const handleMaxPriceChange = (e) => {
    const value = e.target.value;
    // Only allow digits
    if (value === "" || /^\d+$/.test(value)) {
      const numValue = value === "" ? 0 : parseInt(value);
      setMaxPrice(numValue);
      // Update price range slider max value
      setPriceRange([priceRange[0], numValue]);
    }
  };

  // Handle price range input
  const handleRangeChange = (values) => {
    // Slider component returns an array of values
    const [min, max] = values;

    // Update price range state
    setPriceRange([min, max]);

    // Update min and max price inputs
    setMinPrice(min);
    setMaxPrice(max);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format price range as comma-separated string instead of object
      const priceRangeString = `${minPrice || priceRange[0]},${maxPrice || priceRange[1]}`;

      // Map listing type values to what API expects
      let propertyTypeValue = "";
      if (listingType === "sell") {
        propertyTypeValue = "0";
      } else if (listingType === "rent") {
        propertyTypeValue = "1";
      }

      // Prepare the form data with correct format
      const formData = {
        category_ids: selectedInterests.join(","),
        outdoor_facilitiy_ids: selectedPlaces.join(","),
        price_range: priceRangeString,
        property_type: propertyTypeValue,
        city: location.city || "",
      };

      // Submit the form data
      const response = await submitUserInterestsApi(formData);

      if (response.error === false) {
        toast.success(t(response?.message));
      } else {
        toast.error(t(response?.message));
      }

    } catch (error) {
      console.error("Error submitting interests:", error);
      toast.error(t(error?.message));
    } finally {
      setLoading(false);
    }
  };

  // Handle form reset
  const handleReset = async () => {
    setLoading(true);

    try {
      // Call API to delete user interests
      const response = await deleteUserIntrestedDataApi();

      if (response.error === false) {
        // Reset all form fields
        setSelectedInterests([]);
        setSelectedPlaces([]);
        setPriceRange([defaultMinPrice, defaultMaxPrice]);
        setMinPrice(defaultMinPrice);
        setMaxPrice(defaultMaxPrice);
        setLocation({
          city: "",
          state: "",
          country: "",
          latitude: "",
          longitude: "",
          formattedAddress: "",
        });
        setListingType("all");

        toast.success(t(response?.message));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error resetting interests:", error);
      toast.error(t("interestsResetError"));
    } finally {
      setLoading(false);
    }
  };

  // Extract address components from Google Places result
  const extractAddressComponents = (place) => {
    let city = "";
    let state = "";
    let country = "";
    const formattedAddress = place.formatted_address || "";

    // Loop through address components to extract city, state, country
    if (place.address_components && place.address_components.length > 0) {
      for (const component of place.address_components) {
        const types = component.types;

        if (types.includes("locality")) {
          city = component.long_name;
        } else if (types.includes("administrative_area_level_1")) {
          state = component.long_name;
        } else if (types.includes("country")) {
          country = component.long_name;
        }
      }
    }

    return { city, state, country, formattedAddress };
  };

  // Handle Places Autocomplete
  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;

    try {
      const place = autocompleteRef.current.getPlace();

      if (place && place.geometry) {
        const { city, state, country, formattedAddress } =
          extractAddressComponents(place);
        const lat = place.geometry?.location?.lat();
        const lng = place.geometry?.location?.lng();

        if (lat && lng) {
          setLocation({
            city,
            state,
            country,
            latitude: lat,
            longitude: lng,
            formattedAddress,
          });
          console.error("Location set:", {
            city,
            state,
            country,
            lat,
            lng,
            formattedAddress,
          });
        }
      }
    } catch (error) {
      console.error("Place search error:", error);
      toast.error(t("locationError"));
    }
  };

  // Static listing type options
  const listingTypeOptions = [
    { value: "all", label: t("all") },
    { value: "sell", label: t("sell") },
    { value: "rent", label: t("rent") },
  ];

  return (
    <div className="w-full px-4 py-6 sm:px-6 md:px-8">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        {t("personalizeFeed")}
      </h2>
      <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
        {/* Choose Your Interest Section */}
        <div className="mb-6 sm:mb-8">
          <h3 className="mb-3 text-base font-medium text-gray-700 sm:mb-4 sm:text-lg">
            {t("chooseYourInterest")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {loadCategories
              ? // Multiple skeleton items to better represent loading categories
              Array(8)
                .fill(0)
                .map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-10 w-20 rounded-full sm:w-24"
                  />
                ))
              : (categories &&
                categories.length > 0) ?
                categories.map((category) => (
                  <button
                    key={category.id}
                    className={`flex items-center rounded-full border px-3 py-2 text-xs transition-colors sm:text-sm ${selectedInterests.includes(category.id)
                      ? "primaryBg primaryBorderColor text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    onClick={() => toggleInterest(category.id)}
                  >
                    {selectedInterests.includes(category.id) && (
                      <FaCircleCheck size={16} className="mr-2 rtl:ml-2" />
                    )}
                    <span>{category.translated_name || category.category}</span>
                  </button>
                )) : categories?.length === 0 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      {t("noCategoriesFound")}
                    </p>
                  </div>
                )}
          </div>
        </div>

        {/* Choose Nearby Places Section */}
        <div className="mb-6 sm:mb-8">
          <h3 className="mb-2 text-base font-medium text-gray-700 sm:text-lg">
            {t("chooseNearbyPlaces")}
          </h3>
          <p className="mb-3 text-xs text-gray-500 sm:mb-4 sm:text-sm">
            {t("getRecommendationForPropertiesThatAreCloseToTheseLocations")}
          </p>
          <div className="flex flex-wrap gap-2">
            {loadFacilities
              ? Array(8)
                .fill(0)
                .map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-10 w-20 rounded-full sm:w-24"
                  />
                ))
              : (facilities &&
                facilities.length > 0) ?
                facilities.map((place) => (
                  <button
                    key={place.id}
                    className={`flex items-center rounded-full border px-3 py-2 text-xs transition-colors sm:text-sm ${selectedPlaces.includes(place.id)
                      ? "primaryBg primaryBorderColor text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    onClick={() => togglePlace(place.id)}
                  >
                    {selectedPlaces.includes(place.id) && (
                      <FaCircleCheck size={16} className="mr-2 rtl:ml-2" />
                    )}
                    <span>{place.translated_name || place.name}</span>
                  </button>
                )) : facilities?.length === 0 && (
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      {t("noFacilitiesFound")}
                    </p>
                  </div>
                )}
          </div>
        </div>

        {/* Choose Location and Property Type Section */}
        <div className="mb-6 sm:mb-8">
          <h3 className="mb-3 text-base font-medium text-gray-700 sm:mb-4 sm:text-lg">
            {t("chooseYourPreferredLocationAndPropertyType")}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 sm:text-sm">
                {t("selectLocation")}
              </label>
              <div className="relative">
                {!isLoading && !loadError ? (
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={onPlaceChanged}
                  >
                    <div className="w-full">
                      <Input
                        name="location"
                        value={location.city}
                        onChange={(e) =>
                          setLocation({ ...location, city: e.target.value })
                        }
                        placeholder={t("searchLocation")}
                        className="focus-visible:!primaryBorderColor h-10 !w-full rounded border-0 bg-[#F7F7F7] transition-all duration-200 focus-visible:!ring-2 focus-visible:!ring-primary/20 sm:h-12"
                        required
                      />
                    </div>
                  </Autocomplete>
                ) : (
                  <Input
                    name="location"
                    value={location.city}
                    placeholder={
                      mapError ? t("googleMapsNotAvailable") : t("loading")
                    }
                    className="focus-visible:!primaryBorderColor h-10 w-full rounded border-0 bg-[#F7F7F7] transition-all duration-200 focus-visible:!ring-2 focus-visible:!ring-primary/20 sm:h-12"
                    required
                    disabled={isLoading}
                  />
                )}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 sm:text-sm">
                {t("listingType")}
              </label>
              <div className="relative">
                <Select
                  value={listingType}
                  onValueChange={(value) => setListingType(value)}
                  dir={isRtl ? "rtl" : "ltr"}
                >
                  <SelectTrigger className="h-10 w-full border-0 bg-[#F7F7F7] focus:ring-0 sm:h-12">
                    <SelectValue placeholder={t("selectListingType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {listingTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Choose Budget Section */}
        <div className="mb-6 sm:mb-8">
          <h3 className="mb-3 text-base font-medium text-gray-700 sm:mb-4 sm:text-lg">
            {t("chooseTheBudgetForTheProperty")}
          </h3>
          <div className="mb-4 grid grid-cols-1 gap-4 sm:mb-6 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 sm:text-sm">
                {t("minPrice")}
              </label>
              <Input
                type="text"
                placeholder={currency + " " + defaultMinPrice}
                className="focus-visible:!primaryBorderColor h-10 w-full rounded border-0 bg-[#F7F7F7] transition-all duration-200 focus-visible:!ring-2 focus-visible:!ring-primary/20 sm:h-12"
                value={minPrice}
                onChange={handleMinPriceChange}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 sm:text-sm">
                {t("maxPrice")}
              </label>
              <Input
                type="text"
                placeholder={currency + " " + defaultMaxPrice}
                className="focus-visible:!primaryBorderColor h-10 w-full rounded border-0 bg-[#F7F7F7] transition-all duration-200 focus-visible:!ring-2 focus-visible:!ring-primary/20 sm:h-12"
                value={maxPrice}
                onChange={handleMaxPriceChange}
              />
            </div>
          </div>

          <div className="mb-2">
            <div className="mb-1 flex justify-between text-xs text-gray-600 sm:text-sm">
              <span>
                {t("priceRange")} {currency} {priceRange[0]}
                <span className="ltr-number">
                  {" "}{t("to")}{" "}
                </span>
                {currency}
                {priceRange[1]}
              </span>
            </div>
            <div className="py-4">
              <Slider
                isTwoThumb={true}
                defaultValue={[priceRange[0], priceRange[1]]}
                value={[priceRange[0], priceRange[1]]}
                max={defaultMaxPrice}
                min={0}
                step={1000}
                onValueChange={handleRangeChange}
                className="my-4"
              />
            </div>
          </div>
        </div>

        {/* Submit and Reset Buttons */}
        <div className="mt-6 flex justify-end gap-2 sm:mt-8 sm:gap-3">
          <button
            type="button"
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:px-4 sm:py-2 sm:text-sm"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? t("processing") : t("clear")}
          </button>
          <button
            type="button"
            className="primaryBg rounded-md px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 sm:px-4 sm:py-2 sm:text-sm"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? t("processing") : t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPersonalizedFeed;
