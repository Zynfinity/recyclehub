// hooks/useLocationData.js
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@chakra-ui/react';

// Fungsi helper untuk mengambil data API, letakkan di luar komponen atau di utility file
const fetchLocationOptions = async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.map(option => ({ value: option.id, label: option.name }));
};

const useLocationData = (selectedProvinceId, selectedRegencyId, selectedDistrictId, setValue) => {
    const toast = useToast();

    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);

    // Callback untuk fetching data yang bisa digunakan ulang
    const fetchData = useCallback(async (url, setter, resetFields = []) => {
        try {
            const data = await fetchLocationOptions(url);
            setter(data);
            resetFields.forEach(field => setValue(field, "")); // Reset form field
        } catch (err) {
            console.error(`Error fetching data from ${url}:`, err);
            toast({
                title: `Gagal memuat data`,
                description: "Tidak dapat mengambil data lokasi.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [setValue, toast]);

    // Effect untuk mengambil daftar provinsi saat komponen pertama kali dimuat
    useEffect(() => {
        fetchData("https://kanglerian.my.id/api-wilayah-indonesia/api/provinces.json", setProvinces, ["province"]);
    }, [fetchData]);

    // Effect untuk mengambil kabupaten/kota berdasarkan provinsi yang dipilih
    useEffect(() => {
        if (selectedProvinceId) {
            fetchData(`https://kanglerian.my.id/api-wilayah-indonesia/api/regencies/${selectedProvinceId}.json`, setRegencies, ["regency", "district", "village"]);
            setDistricts([]); // Clear subordinate options state
            setVillages([]);
        } else {
            setRegencies([]);
            setValue("regency", "");
        }
    }, [selectedProvinceId, fetchData, setValue]);

    // Effect untuk mengambil kecamatan berdasarkan kabupaten/kota yang dipilih
    useEffect(() => {
        if (selectedRegencyId) {
            fetchData(`https://kanglerian.my.id/api-wilayah-indonesia/api/districts/${selectedRegencyId}.json`, setDistricts, ["district", "village"]);
            setVillages([]); // Clear subordinate options state
        } else {
            setDistricts([]);
            setValue("district", "");
        }
    }, [selectedRegencyId, fetchData, setValue]);

    // Effect untuk mengambil desa/kelurahan berdasarkan kecamatan yang dipilih
    useEffect(() => {
        if (selectedDistrictId) {
            fetchData(`https://kanglerian.my.id/api-wilayah-indonesia/api/villages/${selectedDistrictId}.json`, setVillages, ["village"]);
        } else {
            setVillages([]);
            setValue("village", "");
        }
    }, [selectedDistrictId, fetchData, setValue]);

    return { provinces, regencies, districts, villages };
};

export default useLocationData;