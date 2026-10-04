/**
 * FOREST DATA — VERIFIED OFFICIAL SOURCES
 * Primary Source: Forest Survey of India (FSI), ISFR 2021 / 2023
 * https://fsi.nic.in/
 */

export interface NationalStats {
  reportYear: number;
  source: string;
  sourceUrl: string;
  totalGeographicalArea: number;
  forestCover: {
    areaSqKm: number;
    percentageOfGeoArea: number;
  };
  treeCover: {
    areaSqKm: number;
    percentageOfGeoArea: number;
  };
  totalForestAndTreeCover: {
    areaSqKm: number;
    percentageOfGeoArea: number;
  };
  changeFrom2021: {
    forestCoverChangeSqKm: number;
    treeCoverChangeSqKm: number;
    totalChangeSqKm: number;
  };
  carbonStock: {
    totalMillionTonnes: number;
    changeFromPrevious: string;
  };
}

export const NATIONAL_STATS_2023: NationalStats = {
  reportYear: 2023,
  source: 'Forest Survey of India (FSI), India State of Forest Report 2023',
  sourceUrl: 'https://fsi.nic.in/',
  totalGeographicalArea: 3287263,
  forestCover: {
    areaSqKm: 715343,
    percentageOfGeoArea: 21.76,
  },
  treeCover: {
    areaSqKm: 112014,
    percentageOfGeoArea: 3.41,
  },
  totalForestAndTreeCover: {
    areaSqKm: 827357,
    percentageOfGeoArea: 25.17,
  },
  changeFrom2021: {
    forestCoverChangeSqKm: 1554,
    treeCoverChangeSqKm: -109,
    totalChangeSqKm: 1445,
  },
  carbonStock: {
    totalMillionTonnes: 7285.5,
    changeFromPrevious: '+79.4 million tonnes',
  },
};

export const FOREST_COVER_TREND = [
  { year: 2001, forestCoverSqKm: 675638 },
  { year: 2003, forestCoverSqKm: 678333 },
  { year: 2005, forestCoverSqKm: 677088 },
  { year: 2007, forestCoverSqKm: 690171 },
  { year: 2009, forestCoverSqKm: 690899 },
  { year: 2011, forestCoverSqKm: 692027 },
  { year: 2013, forestCoverSqKm: 697898 },
  { year: 2015, forestCoverSqKm: 701495 },
  { year: 2017, forestCoverSqKm: 708273 },
  { year: 2019, forestCoverSqKm: 712249 },
  { year: 2021, forestCoverSqKm: 713789 },
  { year: 2023, forestCoverSqKm: 715343 },
];

export interface StateForestData {
  state: string;
  forestCoverSqKm: number;
  geoAreaSqKm: number;
  rank: number;
}

export const STATE_FOREST_DATA: StateForestData[] = [
  { state: 'Madhya Pradesh', forestCoverSqKm: 77493, geoAreaSqKm: 308252, rank: 1 },
  { state: 'Arunachal Pradesh', forestCoverSqKm: 66431, geoAreaSqKm: 83743, rank: 2 },
  { state: 'Chhattisgarh', forestCoverSqKm: 55717, geoAreaSqKm: 135192, rank: 3 },
  { state: 'Odisha', forestCoverSqKm: 52156, geoAreaSqKm: 155707, rank: 4 },
  { state: 'Maharashtra', forestCoverSqKm: 50778, geoAreaSqKm: 307713, rank: 5 },
  { state: 'Karnataka', forestCoverSqKm: 38730, geoAreaSqKm: 191791, rank: 6 },
  { state: 'Andhra Pradesh', forestCoverSqKm: 29784, geoAreaSqKm: 162975, rank: 7 },
  { state: 'Assam', forestCoverSqKm: 28312, geoAreaSqKm: 78438, rank: 8 },
  { state: 'Tamil Nadu', forestCoverSqKm: 26419, geoAreaSqKm: 130058, rank: 9 },
  { state: 'Uttarakhand', forestCoverSqKm: 24305, geoAreaSqKm: 53483, rank: 10 },
  { state: 'Jharkhand', forestCoverSqKm: 23721, geoAreaSqKm: 79716, rank: 11 },
  { state: 'Jammu & Kashmir', forestCoverSqKm: 21387, geoAreaSqKm: 42241, rank: 12 },
  { state: 'Kerala', forestCoverSqKm: 21253, geoAreaSqKm: 38852, rank: 13 },
  { state: 'Telangana', forestCoverSqKm: 21214, geoAreaSqKm: 112077, rank: 14 },
  { state: 'Mizoram', forestCoverSqKm: 17820, geoAreaSqKm: 21081, rank: 15 },
  { state: 'Meghalaya', forestCoverSqKm: 17063, geoAreaSqKm: 22429, rank: 16 },
  { state: 'West Bengal', forestCoverSqKm: 16832, geoAreaSqKm: 88752, rank: 17 },
  { state: 'Rajasthan', forestCoverSqKm: 16655, geoAreaSqKm: 342239, rank: 18 },
  { state: 'Manipur', forestCoverSqKm: 16598, geoAreaSqKm: 22327, rank: 19 },
  { state: 'Himachal Pradesh', forestCoverSqKm: 15443, geoAreaSqKm: 55673, rank: 20 },
  { state: 'Gujarat', forestCoverSqKm: 14926, geoAreaSqKm: 196024, rank: 21 },
  { state: 'Uttar Pradesh', forestCoverSqKm: 14818, geoAreaSqKm: 240928, rank: 22 },
  { state: 'Nagaland', forestCoverSqKm: 12251, geoAreaSqKm: 16579, rank: 23 },
  { state: 'Tripura', forestCoverSqKm: 7722, geoAreaSqKm: 10486, rank: 24 },
  { state: 'Bihar', forestCoverSqKm: 7381, geoAreaSqKm: 94163, rank: 25 },
  { state: 'Andaman & Nicobar Islands', forestCoverSqKm: 6744, geoAreaSqKm: 8249, rank: 26 },
  { state: 'Sikkim', forestCoverSqKm: 3341, geoAreaSqKm: 7096, rank: 27 },
  { state: 'Ladakh', forestCoverSqKm: 2272, geoAreaSqKm: 174852, rank: 28 },
  { state: 'Goa', forestCoverSqKm: 2244, geoAreaSqKm: 3702, rank: 29 },
  { state: 'Punjab', forestCoverSqKm: 1847, geoAreaSqKm: 50362, rank: 30 },
  { state: 'Haryana', forestCoverSqKm: 1603, geoAreaSqKm: 44212, rank: 31 },
  { state: 'Dadra & Nagar Haveli and Daman & Diu', forestCoverSqKm: 228, geoAreaSqKm: 603, rank: 32 },
  { state: 'Delhi', forestCoverSqKm: 195, geoAreaSqKm: 1484, rank: 33 },
  { state: 'Puducherry', forestCoverSqKm: 53, geoAreaSqKm: 479, rank: 34 },
  { state: 'Lakshadweep', forestCoverSqKm: 27, geoAreaSqKm: 32, rank: 35 },
  { state: 'Chandigarh', forestCoverSqKm: 23, geoAreaSqKm: 114, rank: 36 },
];

export const FOREST_COVER_CHANGE = [
  { state: 'Andhra Pradesh', changeSqKm: 647 },
  { state: 'Telangana', changeSqKm: 632 },
  { state: 'Odisha', changeSqKm: 537 },
  { state: 'Karnataka', changeSqKm: 155 },
  { state: 'Jharkhand', changeSqKm: 110 },
  { state: 'Uttarakhand', changeSqKm: 2 },
  { state: 'Arunachal Pradesh', changeSqKm: -221 },
  { state: 'Manipur', changeSqKm: -249 },
  { state: 'Nagaland', changeSqKm: -235 },
  { state: 'Mizoram', changeSqKm: -186 },
];

export const AFFORESTATION_SCHEMES = [
  {
    name: 'Green India Mission (GIM)',
    ministry: 'MoEFCC',
    objective: 'Increase forest/tree cover on 5 million hectares and improve ecosystem services',
    targetAreaHectares: 5000000,
    targetYear: 2030,
    status: 'Ongoing',
    sourceNote: 'National Mission for a Green India under NAPCC',
  },
  {
    name: 'CAMPA (Compensatory Afforestation)',
    ministry: 'MoEFCC',
    objective: 'Afforestation/reforestation in lieu of forest land diverted for developmental activities',
    fundSizeInr: '₹47,436 Crore corpus',
    status: 'Active',
    sourceNote: 'Compensatory Afforestation Fund Act, 2016',
  },
  {
    name: 'National Afforestation Programme (NAP)',
    ministry: 'MoEFCC',
    objective: 'Eco-restoration of degraded forests through participatory Joint Forest Management Committees',
    status: 'Ongoing',
    sourceNote: 'MoEFCC Annual Reports',
  },
  {
    name: 'Sub-Mission on Agroforestry (SMAF)',
    ministry: 'Ministry of Agriculture',
    objective: 'Promote tree planting on farm lands to increase green cover and farmer income',
    status: 'Ongoing',
    sourceNote: 'Department of Agriculture & Farmers Welfare',
  },
];

export interface SatelliteSite {
  id: string;
  name: string;
  shortName: string;
  lat: number;
  lng: number;
  zoom: number;
  description: string;
  forestType: string;
  significanceNote: string;
  sentinelBrowserUrl: string;
  imageCredit: string;
}

export const SATELLITE_SITES: SatelliteSite[] = [
  {
    id: 'western-ghats',
    name: 'Western Ghats — Karnataka / Kerala',
    shortName: 'Western Ghats',
    lat: 12.5,
    lng: 75.8,
    zoom: 10,
    description: 'UNESCO World Heritage Site; one of the world\'s 8 "hottest hotspots" of biological diversity. Dense tropical evergreen and semi-evergreen forests.',
    forestType: 'Tropical Evergreen / Semi-Evergreen',
    significanceNote: 'Biodiversity hotspot & major water catchment for peninsular India',
    sentinelBrowserUrl: 'https://browser.dataspace.copernicus.eu/?zoom=10&lat=12.5&lng=75.8&layerId=2_FALSE_COLOR',
    imageCredit: 'Copernicus Sentinel-2, ESA/EU via Copernicus Data Space',
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans Mangroves — West Bengal',
    shortName: 'Sundarbans',
    lat: 21.9497,
    lng: 89.1833,
    zoom: 10,
    description: 'World\'s largest contiguous mangrove forest; UNESCO World Heritage Site and Ramsar Wetland. Critical carbon sink and Bengal tiger habitat.',
    forestType: 'Mangrove Forest',
    significanceNote: 'Coastal storm barrier, Bengal tiger reserve & massive carbon sink',
    sentinelBrowserUrl: 'https://browser.dataspace.copernicus.eu/?zoom=10&lat=21.9497&lng=89.1833&layerId=2_FALSE_COLOR',
    imageCredit: 'Copernicus Sentinel-2, ESA/EU via Copernicus Data Space',
  },
  {
    id: 'northeast-india',
    name: 'Northeast India — Arunachal Pradesh',
    shortName: 'Northeast India',
    lat: 27.0,
    lng: 93.0,
    zoom: 9,
    description: 'India\'s second-largest state by forest cover (66,431 sq km). Sub-tropical broadleaf and temperate forests part of the Indo-Burma biodiversity hotspot.',
    forestType: 'Sub-tropical Broadleaf / Temperate',
    significanceNote: 'Second highest forest cover state in India; mega-biodiversity zone',
    sentinelBrowserUrl: 'https://browser.dataspace.copernicus.eu/?zoom=9&lat=27.0&lng=93.0&layerId=2_FALSE_COLOR',
    imageCredit: 'Copernicus Sentinel-2, ESA/EU via Copernicus Data Space',
  },
  {
    id: 'central-india',
    name: 'Central Indian Highlands — Madhya Pradesh',
    shortName: 'Central India (MP)',
    lat: 22.5,
    lng: 78.5,
    zoom: 9,
    description: 'India\'s largest state by total forest cover (77,493 sq km). Sal and teak deciduous forests hosting major tiger corridors.',
    forestType: 'Tropical Dry / Moist Deciduous',
    significanceNote: 'Largest forest area in India; primary tiger reserve connectivity network',
    sentinelBrowserUrl: 'https://browser.dataspace.copernicus.eu/?zoom=9&lat=22.5&lng=78.5&layerId=2_FALSE_COLOR',
    imageCredit: 'Copernicus Sentinel-2, ESA/EU via Copernicus Data Space',
  },
  {
    id: 'himalayan-foothills',
    name: 'Himalayan Foothills — Uttarakhand',
    shortName: 'Uttarakhand Himalayas',
    lat: 30.0,
    lng: 79.5,
    zoom: 9,
    description: 'Temperate and sub-alpine pine/oak forests in the Garhwal Himalaya (24,305 sq km forest cover). Essential watershed for the Ganga river system.',
    forestType: 'Temperate Coniferous / Sub-Alpine',
    significanceNote: 'Critical Himalayan watershed & alpine eco-monitoring region',
    sentinelBrowserUrl: 'https://browser.dataspace.copernicus.eu/?zoom=9&lat=30.0&lng=79.5&layerId=2_FALSE_COLOR',
    imageCredit: 'Copernicus Sentinel-2, ESA/EU via Copernicus Data Space',
  },
];

export const CHOROPLETH_COLORS = {
  getColor: (pct: number) => {
    if (pct > 75) return '#1a7c3e';
    if (pct > 60) return '#238b45';
    if (pct > 45) return '#41ab5d';
    if (pct > 30) return '#74c476';
    if (pct > 20) return '#a1d99b';
    if (pct > 10) return '#c7e9c0';
    if (pct > 5) return '#e5f5e0';
    return '#f7fcf5';
  },
  legendBands: [
    { min: 75, max: 100, color: '#1a7c3e', label: '> 75%' },
    { min: 60, max: 75, color: '#238b45', label: '60–75%' },
    { min: 45, max: 60, color: '#41ab5d', label: '45–60%' },
    { min: 30, max: 45, color: '#74c476', label: '30–45%' },
    { min: 20, max: 30, color: '#a1d99b', label: '20–30%' },
    { min: 10, max: 20, color: '#c7e9c0', label: '10–20%' },
    { min: 5, max: 10, color: '#e5f5e0', label: '5–10%' },
    { min: 0, max: 5, color: '#f7fcf5', label: '< 5%' },
  ],
};
