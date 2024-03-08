"use client";

import React, { useState, useTransition } from "react";

import { syncAll } from "@/actions/sync/common";
import { syncManufacturers } from "@/actions/sync/manufacturers";
import { syncMeasurementUnits } from "@/actions/sync/measurement-units";
import { syncNomenclature } from "@/actions/sync/nomenclature";
import { syncNomenclatureTypes } from "@/actions/sync/nomenclature-types";
import { syncPrices } from "@/actions/sync/prices";
import { syncStock } from "@/actions/sync/stock";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { IActionResponse } from "@/lib/common-types";
import { ISyncLogMeta, SyncType } from "@/lib/sync";

type SyncFormType = SyncType | "all";

interface SyncFormProps {
  syncType: SyncFormType;
}

const SyncForm = ({ syncType }: SyncFormProps) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  let formTitle;
  let action: () => Promise<IActionResponse<any>>;
  switch (syncType) {
    case "manufacturers":
      formTitle = "Синхронизация производителей";
      action = syncManufacturers;
      break;
    case "measurement-units":
      formTitle = "Синхронизация единиц измерения";
      action = syncMeasurementUnits;
      break;
    case "nomenclature":
      formTitle = "Синхронизация номенклатуры";
      action = syncNomenclature;
      break;
    case "nomenclature-types":
      formTitle = "Синхронизация типов номенклатуры";
      action = syncNomenclatureTypes;
      break;
    case "prices":
      formTitle = "Синхронизация цен";
      action = syncPrices;
      break;
    case "stock":
      formTitle = "Синхронизация остатков";
      action = syncStock;
      break;
    case "all":
    default:
      formTitle = "Синхронизация всех данных";
      action = syncAll;
      break;
  }

  const handleClick = () => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await action();
      if (result.status === "success") {
        const meta: ISyncLogMeta = {
          entitiesCreated: 0,
          entitiesFrom1C: 0,
          entitiesIgnored: 0,
          entitiesMarkedDeleted: 0,
          entitiesUpdated: 0,
        };
        if (Array.isArray(result.data)) {
          console.log(typeof result.data);
          console.log(result.data);
          for (const syncMeta of result.data) {
            meta.entitiesCreated += syncMeta.metadata.entitiesCreated;
            meta.entitiesFrom1C += syncMeta.metadata.entitiesFrom1C;
            meta.entitiesIgnored += syncMeta.metadata.entitiesIgnored;
            meta.entitiesMarkedDeleted +=
              syncMeta.metadata.entitiesMarkedDeleted;
            meta.entitiesUpdated += syncMeta.metadata.entitiesUpdated;
          }
        } else if (typeof result.data === "object") {
          const syncMeta = result.data.metadata as ISyncLogMeta;
          if (syncMeta) {
            meta.entitiesCreated = syncMeta.entitiesCreated;
            meta.entitiesFrom1C = syncMeta.entitiesFrom1C;
            meta.entitiesIgnored = syncMeta.entitiesIgnored;
            meta.entitiesMarkedDeleted = syncMeta.entitiesMarkedDeleted;
            meta.entitiesUpdated = syncMeta.entitiesUpdated;
          }
        }

        setSuccess(
          `Данные успешно синхронизированы. Всего объектов из 1С: ${meta.entitiesFrom1C}. 
          Создано: ${meta.entitiesCreated}, обновлено: ${meta.entitiesUpdated}, 
          пометок удаления поставлено или снято: ${meta.entitiesMarkedDeleted}, 
          пропущено: ${meta.entitiesIgnored}`,
        );
      } else {
        setError(result.error ?? "Ошибка при синхронизации");
      }
    });
  };

  return (
    <div className="my-2 p-2 flex flex-col gap-4 justify-center items-center">
      <h2 className="text-xl">{formTitle}</h2>
      <Button onClick={handleClick} disabled={isPending} type="button">
        Синхронизировать {isPending ? "..." : ""}
      </Button>
      {error && <FormError message={error} />}
      {success && <FormSuccess message={success} />}
    </div>
  );
};

export default SyncForm;