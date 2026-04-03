import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import client from '../api/client';
import type { School, Institution, Cluster, Column } from '../types';
import SearchDropdown from '../components/ui/SearchDropdown';
import DataTable from '../components/ui/DataTable';
import Pagination from '../components/ui/Pagination';
import RowPerPage from '../components/ui/RowPerPage';
import { useSort } from '../hooks/useSort';
import { usePagination } from '../hooks/usePagination';

export default function ClusterListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [schools, setSchools] = useState<School[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedInstitution, setSelectedInstitution] = useState('');
  const [selectedCluster, setSelectedCluster] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');

  const { sorts, handleSort, sortData } = useSort();

  useEffect(() => {
    async function fetchData() {
      try {
        const [schoolsRes, institutionsRes, clustersRes] = await Promise.all([
          client.get('/enuma-admin/clusters'),
          client.get('/enuma-admin/institutions'),
          client.get('/enuma-admin/clusters-list'),
        ]);
        setSchools(schoolsRes.data);
        setInstitutions(institutionsRes.data);
        setClusters(clustersRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Cascading filter options
  const filteredClusters = useMemo(() => {
    if (!selectedInstitution) return clusters;
    return clusters.filter((c) => c.institutionId === selectedInstitution);
  }, [clusters, selectedInstitution]);

  const filteredSchoolOptions = useMemo(() => {
    let result = schools;
    if (selectedInstitution) {
      result = result.filter((s) => s.institutionId === selectedInstitution);
    }
    if (selectedCluster) {
      result = result.filter((s) => s.clusterId === selectedCluster);
    }
    return result;
  }, [schools, selectedInstitution, selectedCluster]);

  // Apply filters to data
  const filteredData = useMemo(() => {
    let result = schools;
    if (selectedInstitution) {
      result = result.filter((s) => s.institutionId === selectedInstitution);
    }
    if (selectedCluster) {
      result = result.filter((s) => s.clusterId === selectedCluster);
    }
    if (selectedSchool) {
      result = result.filter((s) => s.id === selectedSchool);
    }
    return sortData(result);
  }, [schools, selectedInstitution, selectedCluster, selectedSchool, sortData]);

  const {
    currentPage, rowsPerPage, totalPages, paginatedData, totalCount,
    handlePageChange, handleRowsPerPageChange, resetPage,
  } = usePagination(filteredData);

  // Reset pagination when filters change
  const handleInstitutionChange = useCallback((value: string) => {
    setSelectedInstitution(value);
    setSelectedCluster('');
    setSelectedSchool('');
    resetPage();
  }, [resetPage]);

  const handleClusterChange = useCallback((value: string) => {
    setSelectedCluster(value);
    setSelectedSchool('');
    resetPage();
  }, [resetPage]);

  const handleSchoolChange = useCallback((value: string) => {
    setSelectedSchool(value);
    resetPage();
  }, [resetPage]);

  const columns: Column<School>[] = [
    {
      key: 'institutionName',
      header: t('clusterList.institution'),
      sortable: true,
      width: '180px',
      render: (row) =>
        row.institutionName ? (
          <button
            onClick={() => navigate(`/institutions/${row.institutionId}/student-dashboard`)}
            className="text-primary-red underline cursor-pointer border-none bg-transparent text-[14px] font-normal"
          >
            {row.institutionName}
          </button>
        ) : null,
    },
    {
      key: 'clusterName',
      header: t('clusterList.clusterName'),
      sortable: true,
      width: '180px',
      render: (row) =>
        row.clusterName ? (
          <button
            onClick={() => navigate(`/clusters/${row.clusterId}/student-dashboard`)}
            className="text-primary-red underline cursor-pointer border-none bg-transparent text-[14px] font-normal"
          >
            {row.clusterName}
          </button>
        ) : null,
    },
    { key: 'name', header: t('clusterList.schoolName'), sortable: true, width: '200px', render: (row) => row.name },
    { key: 'licenseName', header: t('clusterList.licenseName'), width: '150px', render: (row) => row.licenseName },
    { key: 'licenseIssued', header: t('clusterList.licenseIssued'), sortable: true, width: '120px', render: (row) => row.licenseIssued },
    { key: 'licenseInUse', header: t('clusterList.licenseInUse'), sortable: true, width: '120px', render: (row) => row.licenseInUse },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-[400px] text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-[18px] font-semibold text-gray-950 m-0 mb-[20px]">
        {t('clusterList.title')}
      </h2>

      {/* Filters */}
      <div className="flex gap-[12px] mb-[16px]">
        <SearchDropdown
          options={institutions.map((i) => ({ value: i.id, label: i.name }))}
          value={selectedInstitution}
          onChange={handleInstitutionChange}
          placeholder={t('clusterList.allInstitutions')}
          className="w-[280px]"
        />
        <SearchDropdown
          options={filteredClusters.map((c) => ({ value: c.id, label: c.name }))}
          value={selectedCluster}
          onChange={handleClusterChange}
          placeholder={t('clusterList.allClusters')}
          className="w-[280px]"
        />
        <SearchDropdown
          options={filteredSchoolOptions.map((s) => ({ value: s.id, label: s.name }))}
          value={selectedSchool}
          onChange={handleSchoolChange}
          placeholder={t('clusterList.allSchools')}
          className="w-[280px]"
        />
      </div>

      {/* Results count */}
      <p className="text-[14px] text-gray-700 mb-[12px]">
        <Trans i18nKey="common.showingResults" values={{ count: totalCount }}>
          Showing <span className="text-primary-red font-medium">{{ count: totalCount } as any}</span> result(s)
        </Trans>
      </p>

      {/* Table */}
      <div className="bg-white rounded-[6px]">
        <DataTable
          columns={columns}
          data={paginatedData}
          sorts={sorts}
          onSort={handleSort}
          keyExtractor={(row) => row.id}
        />
      </div>

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="flex items-center justify-center gap-[10px] h-[64px] relative">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
          <div className="absolute right-0">
            <RowPerPage value={rowsPerPage} onChange={handleRowsPerPageChange} />
          </div>
        </div>
      )}
    </div>
  );
}
