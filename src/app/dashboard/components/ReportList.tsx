// components/ReportList.tsx
import React, { useState } from "react";
import FilterModal from "./FilterModal";
import { Filter } from "lucide-react";
import { Report } from "../models";
import { getBrokenType, Progress, TypeReport } from "../constant";

// Interface untuk filter
export interface ReportFilters {
  report_type?: string;
  broken_type?: string;
  progress?: string;
}

interface ReportListProps {
  reports: Report[];
  onReportClick: (report: Report) => void;
  onPreviewImage: (image: string | null) => void;
  previewImage: string | null;
}

export default function ReportList({ reports, onReportClick, onPreviewImage, previewImage }: ReportListProps) {
  const [filters, setFilters] = useState<ReportFilters>({
    report_type: "",
    broken_type: "",
    progress: "",
  });

  const [showFilterModal, setShowFilterModal] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredReports = reports.filter((report) => {
    const reportTypeMatch = !filters.report_type || report.report_type === filters.report_type;
    const brokenTypeMatch = !filters.broken_type || report.broken_type === filters.broken_type;
    const progressMatch = !filters.progress || report.progress === filters.progress;
    return reportTypeMatch && brokenTypeMatch && progressMatch;
  });

  return (
    <section className="w-full ">
      {/* 🔹 Kontainer sticky untuk header dan filter */}
      <div className="sticky top-0 z-10 bg-gray-50 pt-8 pb-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            Daftar Report
          </h3>
          
          {/* 🔹 Tampilan filter untuk mobile (tombol modal) */}
          <div className="mb-4 block md:hidden">
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center px-2 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition w-full justify-center"
            >
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* 🔹 Tampilan filter untuk desktop (filter langsung) */}
        <div className="bg-white p-4 rounded-lg shadow mb-6 hidden md:flex flex-row gap-4 text-gray-500">
          {/* Filter Progress */}
          <select
            name="progress"
            className="border rounded-lg p-2 text-sm w-full"
            value={filters.progress}
            onChange={handleFilterChange}
          >
            <option value="">Semua Progress</option>
            <option value="A">Antrian</option>
            <option value="P">Proses</option>
            <option value="S">Selesai</option>
            <option value="T">Tolak</option>
          </select>

          {/* Filter Broken Type */}
          <select
            name="broken_type"
            className="border rounded-lg p-2 text-sm w-full"
            value={filters.broken_type}
            onChange={handleFilterChange}
          >
            <option value="">Semua Kerusakan</option>
            <option value="SP">Sedikit Rusak</option>
            <option value="R">Rusak</option>
            <option value="SR">Sarana</option>
          </select>

          {/* Filter Report Type */}
          <select
            name="report_type"
            className="border rounded-lg p-2 text-sm w-full"
            value={filters.report_type}
            onChange={handleFilterChange}
          >
            <option value="">Semua Tipe Report</option>
            <option value="FK">Fasilitas Kamar</option>
            <option value="FU">Fasilitas Umum</option>
            <option value="K">Kebersihan</option>
          </select>
        </div>
      </div>
      
      {/* Daftar Laporan */}
      {filteredReports.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center border border-gray-100">
          <p className="text-gray-600">Tidak ada report yang sesuai filter.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[450px] overflow-y-auto grid grid-cols-1 sm:md:grid-cols-2 md:grid-cols-3 gap-2">
          {filteredReports.map((r, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex sm:flex-row items-center justify-between sm:items-center border-b border-gray-100 pb-3 mb-3 gap-2">
                <div>
                  <p className="text-sm text-gray-500">Report Type</p>
                  <p className={`text-base font-semibold text-slate-900 capitalize`}>
                    {TypeReport(r.report_type).label}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium capitalize w-full text-center max-w-[8rem] ${getBrokenType(r.broken_type).className}`}>
                  {getBrokenType(r.broken_type).label}
                </div>
              </div>
              <div className="flex gap-2 text-sm">
                <p className="text-gray-500">Status:</p>
                <p className={`font-medium text-gray-800 px-2 capitalize ${Progress(r.progress).className}`}>
                  {Progress(r.progress).label}
                </p>
              </div>
              <div className="mt-3">
                <p className="text-gray-500 text-sm">Catatan</p>
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                  {r.complain_des || ""}
                  {r.broken_des || ""}
                </p>
              </div>
              <div className="mt-3">
                <p className="text-gray-500 text-sm">Balasan Admin</p>
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                  {r.admin_note || ""}
                </p>
              </div>
              {r.image && (
                <div className="mt-4">
                  <img
                    src={r.image}
                    alt="image-report"
                    className="w-32 h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                    onClick={() => onPreviewImage(r.image)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Komponen modal filter */}
      <FilterModal
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </section>
  );
}