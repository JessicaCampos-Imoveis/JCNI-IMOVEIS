"use client";

import { useState } from "react";
import Link from "next/link";
import { ImovelForm, FORM_INICIAL, type ImovelFormData } from "../_components/ImovelForm";

export default function NovoImovelPage() {
  const [values, setValues] = useState<ImovelFormData>(FORM_INICIAL);

  return (
    <div className="form-page">
      <div className="form-page-header">
        <div>
          <Link href="/admin/imoveis" className="breadcrumb">← Imóveis</Link>
          <h1 className="form-page-title">Novo Imóvel</h1>
        </div>
      </div>

      <div className="form-card">
        <ImovelForm
          values={values}
          onChange={(updated) => setValues((prev) => ({ ...prev, ...updated }))}
        />
      </div>

      <style>{`
        .form-page { padding: 1.5rem; max-width: 800px; margin: 0 auto; }
        .form-page-header { margin-bottom: 1.25rem; }
        .breadcrumb { font-size: 0.875rem; color: #6b7280; text-decoration: none; display: inline-block; margin-bottom: 0.5rem; }
        .breadcrumb:hover { color: #374151; }
        .form-page-title { font-size: 1.5rem; font-weight: 700; margin: 0; }
        .form-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 10px; padding: 1.5rem; }

        @media (max-width: 640px) {
          .form-page { padding: 1rem; }
          .form-page-title { font-size: 1.3rem; }
          .form-card { padding: 1rem; border-radius: 12px; }
        }
      `}</style>
    </div>
  );
}
