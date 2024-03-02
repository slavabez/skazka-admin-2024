import { env } from "@/env.mjs";

export type ODataResponse =
  | {
      "odata.metadata": string;
      value: unknown[];
    }
  | {
      "odata.error": {
        code: string;
        message: {
          lang: string;
          value: string;
        };
      };
    };

export interface NomenclatureType1CFields {
  Ref_Key: string;
  DeletionMark: boolean;
  Parent_Key: string;
  IsFolder: boolean;
  Description: string;
  Описание: string;
  DataVersion: string;
}

export interface Nomenclature1CFields {
  Ref_Key: string;
  Parent_Key: string;
  IsFolder: boolean;
  Description: string;
  Code: string;
  Описание?: string;
  ВесИспользовать: boolean;
  ВидНоменклатуры_Key: string;
  ЕдиницаИзмерения_Key: string;
  Производитель_Key?: string;
  DataVersion: string;
  DeletionMark: boolean;
  ДополнительныеРеквизиты: {
    Ref_Key: string;
    Значение: string | number;
    Свойство_Key: string;
  }[];
}

export interface IFileFields {
  Ref_Key: string;
  ПутьКФайлу: string;
  ВладелецФайла_Key: string;
}

export interface IStockFields {
  ВНаличииBalance: number;
  ВРезервеСоСкладаBalance: number;
  ВРезервеПодЗаказBalance: number;
  Номенклатура_Key: string;
}

export interface IPriceFields {
  Recorder: string;
  Цена: number;
  Period: string;
  Номенклатура_Key: string;
  Упаковка_Key: string;
}

export interface IUnitFields {
  Ref_Key: string;
  Owner: string;
  Description: string;
  Вес: number;
  Числитель: number;
  Знаменатель: number;
  DataVersion: string;
  DeletionMark: boolean;
}

export interface Manufacturer1CFields {
  Ref_Key: string;
  IsFolder: boolean;
  Description: string;
  DataVersion: string;
  DeletionMark: boolean;
}

export interface IOrderFields {
  Ref_Key: string;
  Number: string;
  СуммаДокумента: number;
  Статус: string;
  ФормаОплаты: string;
  ДатаОтгрузки: string;
  АдресДоставки: string;
  СпособДоставки: string;
  Партнер: {
    Description: string;
  };
  DeletionMark: boolean;
}

export interface IOrderContentFields {
  LineNumber: number;
  Количество: number;
  Цена: number;
  Сумма: number;
  СуммаНДС: number;
  СуммаСНДС: number;
  СуммаРучнойСкидки: number;
  СуммаАвтоматическойСкидки: number;
  Отменено: boolean;
  Номенклатура: {
    Description: string;
  };
}

export interface ISalesByPartnersFields {
  КоличествоTurnover: number;
  СуммаВыручкиTurnover: number;
  СуммаВыручкиБезНДСTurnover: number;
  СуммаАвтоматическойСкидкиTurnover: number;
  АналитикаУчетаПоПартнерам: {
    Партнер_Key: string;
    Контрагент: string;
    Description: string;
  };
}

export interface ISalesByNomenclatureFields {
  КоличествоTurnover: number;
  СуммаВыручкиTurnover: number;
  СуммаВыручкиБезНДСTurnover: number;
  СуммаАвтоматическойСкидкиTurnover: number;
  АналитикаУчетаНоменклатуры: {
    Номенклатура_Key: string;
    Склад: string;
    Description: string;
  };
}

export interface ISalesByPartnersAndNomenclatureFields {
  КоличествоTurnover: number;
  СуммаВыручкиTurnover: number;
  СуммаВыручкиБезНДСTurnover: number;
  СуммаАвтоматическойСкидкиTurnover: number;
  АналитикаУчетаНоменклатуры: {
    Номенклатура_Key: string;
    Склад: string;
    Description: string;
  };
  АналитикаУчетаПоПартнерам: {
    Партнер_Key: string;
    Контрагент: string;
    Description: string;
  };
}

export interface IUserFields {
  Ref_Key: string;
  DataVersion: string;
  DeletionMark: boolean;
  Description: string;
  Недействителен: boolean;
  ДополнительныеРеквизиты: {
    Свойство_Key: string;
    Значение: string | number;
  }[];
  ФизическоеЛицо: {
    Ref_Key: string;
    DeletionMark: boolean;
    Description: string;
    ДатаРождения: string;
    ИНН: string;
    КонтактнаяИнформация: {
      Тип: string;
      Представление: string;
    }[];
  };
}

export async function getSpecificODataResponse({
  path,
  filter,
  select,
  expand,
  orderBy,
  top,
  skip,
}: {
  path: string;
  filter?: string;
  select?: string;
  expand?: string;
  orderBy?: string;
  top?: number;
  skip?: number;
}) {
  const authHeader = env.ODATA_API_AUTH_HEADER;
  const baseUrl = env.ODATA_API_URL;

  // Cannot use URLParams because it encodes and breaks the OData query
  let params = `$format=json`;
  if (filter) {
    params = `${params}&$filter=${filter}`;
  }
  if (select) {
    params = `${params}&$select=${select}`;
  }
  if (expand) {
    params = `${params}&$expand=${expand}`;
  }
  if (orderBy) {
    params = `${params}&$orderby=${orderBy}`;
  }
  if (top) {
    params = `${params}&$top=${top}`;
  }
  if (skip) {
    params = `${params}&$skip=${skip}`;
  }
  try {
    const fullUrl = `${baseUrl}${path}?${params}`;
    console.info(`Fetching OData response from "${fullUrl}"`);
    // Use fetch to get the response from the OData API
    const response = await fetch(fullUrl, {
      headers: {
        Authorization: authHeader,
      },
    });
    // Get the JSON response from the OData API
    const odataResponse: ODataResponse =
      (await response.json()) as ODataResponse;
    // Check if the response is an error
    if ("odata.error" in odataResponse) {
      throw new Error(odataResponse["odata.error"].message.value);
    }
    return odataResponse.value;
  } catch (e) {
    console.error("Error while getting OData response", e);
    throw e;
  }
}

export class From1C {
  static async getAllNomenclatureTypes(): Promise<NomenclatureType1CFields[]> {
    return getSpecificODataResponse({
      path: "Catalog_ВидыНоменклатуры",
      select:
        "Ref_Key,DeletionMark,Parent_Key,IsFolder,Description,Описание,DataVersion",
      //filter: `DeletionMark eq false`,
      orderBy: "IsFolder desc",
    }) as Promise<NomenclatureType1CFields[]>;
  }

  static async getAllNomenclatureItems(): Promise<Nomenclature1CFields[]> {
    return getSpecificODataResponse({
      path: "Catalog_Номенклатура",
      select:
        "Ref_Key,Parent_Key,IsFolder,ВидНоменклатуры_Key,Description,Code,Описание,ЕдиницаИзмерения_Key,Производитель_Key,DataVersion,DeletionMark,ДополнительныеРеквизиты/Ref_Key,ДополнительныеРеквизиты/Значение,ДополнительныеРеквизиты/Свойство_Key",
      filter: `DeletionMark eq false`,
      orderBy: "IsFolder desc",
    }) as Promise<Nomenclature1CFields[]>;
  }

  static async getNomenclatureByType(
    typeId: string,
  ): Promise<Nomenclature1CFields[]> {
    return getSpecificODataResponse({
      path: "Catalog_Номенклатура",
      select:
        "Ref_Key,Parent_Key,IsFolder,Code,Description,ЕдиницаИзмерения_Key,Производитель_Key",
      filter: `DeletionMark eq false and ВидНоменклатуры_Key eq guid'${typeId}'`,
    }) as Promise<Nomenclature1CFields[]>;
  }

  static async getNomenclatureItem(
    nId: string,
  ): Promise<Nomenclature1CFields[]> {
    return getSpecificODataResponse({
      path: "Catalog_Номенклатура",
      select:
        "Ref_Key,Parent_Key,IsFolder,Code,Description,ЕдиницаИзмерения_Key,Производитель_Key",
      filter: `DeletionMark eq false and Ref_Key eq guid'${nId}'`,
    }) as Promise<Nomenclature1CFields[]>;
  }

  static async getAllNomenclatureFiles(): Promise<IFileFields[]> {
    return getSpecificODataResponse({
      path: "Catalog_НоменклатураПрисоединенныеФайлы",
      select: "Ref_Key,ПутьКФайлу,ВладелецФайла_Key",
      filter: `DeletionMark eq false`,
    }) as Promise<IFileFields[]>;
  }

  static async getAllStock(): Promise<IStockFields[]> {
    const warehouseId = env.MAIN_WAREHOUSE_UUID;
    return getSpecificODataResponse({
      path: "AccumulationRegister_СвободныеОстатки/Balance(Dimensions='Номенклатура,Склад')",
      filter: `Склад_Key eq guid'${warehouseId}'`,
      select:
        "ВНаличииBalance,ВРезервеСоСкладаBalance,ВРезервеПодЗаказBalance,Номенклатура_Key",
    }) as Promise<IStockFields[]>;
  }

  static async getStockForNomenclature(nId: string): Promise<IStockFields[]> {
    const warehouseId = env.MAIN_WAREHOUSE_UUID;
    return getSpecificODataResponse({
      path: "AccumulationRegister_СвободныеОстатки/Balance",
      filter: `Номенклатура_Key eq guid'${nId}' and Склад_Key eq guid'${warehouseId}'`,
    }) as Promise<IStockFields[]>;
  }

  static async getAllPrices(): Promise<IPriceFields[]> {
    const priceTypeId = env.MAIN_PRICE_TYPE_UUID;
    return getSpecificODataResponse({
      path: "InformationRegister_ЦеныНоменклатуры_RecordType/SliceLast",
      select: "Recorder,Period,Цена,Упаковка_Key,Номенклатура_Key",
      filter: `ВидЦены_Key eq guid'${priceTypeId}'`,
    }) as Promise<IPriceFields[]>;
  }

  static async getPriceForNomenclature(nId: string): Promise<IPriceFields[]> {
    const priceTypeId = env.MAIN_PRICE_TYPE_UUID;
    return getSpecificODataResponse({
      path: "InformationRegister_ЦеныНоменклатуры_RecordType/SliceLast",
      select: "Цена,Period,Упаковка_Key",
      filter: `Номенклатура_Key eq guid'${nId}' and ВидЦены_Key eq guid'${priceTypeId}'`,
    }) as Promise<IPriceFields[]>;
  }

  static async getNomenclatureMeasurementUnits(
    nId: string,
  ): Promise<IUnitFields[]> {
    return getSpecificODataResponse({
      path: "Catalog_УпаковкиЕдиницыИзмерения",
      select: "Ref_Key,Description,Вес,Числитель,Знаменатель",
      filter: `Owner eq cast(guid'${nId}', 'Catalog_Номенклатура')`,
    }) as Promise<IUnitFields[]>;
  }

  static async getAllMeasurementUnits(): Promise<IUnitFields[]> {
    return getSpecificODataResponse({
      path: "Catalog_УпаковкиЕдиницыИзмерения",
      select:
        "Ref_Key,Description,DeletionMark,DataVersion,Owner,Вес,Числитель,Знаменатель",
    }) as Promise<IUnitFields[]>;
  }

  static async getAllManufacturers(): Promise<Manufacturer1CFields[]> {
    return getSpecificODataResponse({
      path: "Catalog_Производители",
      select: "Ref_Key,DataVersion,DeletionMark,IsFolder,Description",
      filter: `IsFolder eq false`,
    }) as Promise<Manufacturer1CFields[]>;
  }

  static async getOrdersForUserByDate({
    userId,
    startDate,
    endDate,
  }: {
    userId: string;
    startDate: string;
    endDate: string;
  }): Promise<IOrderFields[]> {
    return getSpecificODataResponse({
      path: "Document_ЗаказКлиента",
      select:
        "Ref_Key,Number,Date,СуммаДокумента,Статус,ФормаОплаты,ДатаОтгрузки,АдресДоставки,СпособДоставки,Партнер/Description,DeletionMark",
      filter: `Менеджер_Key eq guid'${userId}' and Date ge datetime'${startDate}T00:00:00' and Date le datetime'${endDate}T23:59:59'`,
      expand: "Партнер",
    }) as Promise<IOrderFields[]>;
  }

  static async getOrdersForUserByDeliveryDate({
    userId,
    startDate,
    endDate,
  }: {
    userId: string;
    startDate: string;
    endDate: string;
  }): Promise<IOrderFields[]> {
    return getSpecificODataResponse({
      path: "Document_ЗаказКлиента",
      select:
        "Ref_Key,Number,Date,СуммаДокумента,Статус,ФормаОплаты,ДатаОтгрузки,АдресДоставки,СпособДоставки,Партнер/Description,DeletionMark",
      filter: `Менеджер_Key eq guid'${userId}' and ДатаОтгрузки ge datetime'${startDate}T00:00:00' and ДатаОтгрузки le datetime'${endDate}T23:59:59'`,
      expand: "Партнер",
    }) as Promise<any[]>;
  }

  static async getOrderContent(
    orderId: string,
  ): Promise<IOrderContentFields[]> {
    return getSpecificODataResponse({
      path: `Document_ЗаказКлиента_Товары`,
      filter: `Ref_Key eq guid'${orderId}'`,
      expand: `Номенклатура`,
      select: `LineNumber,Количество,Цена,Сумма,СуммаНДС,СуммаСНДС,СуммаРучнойСкидки,СуммаАвтоматическойСкидки,Отменено,Номенклатура/Description`,
    }) as Promise<any[]>;
  }

  /**
   *
   * @param managerId - guid
   * @param startDate - has to be a string formatted as "YYYY-MM-DDTHH:MM:SS"
   * @param endDate - has to be a string formatted as "YYYY-MM-DDTHH:MM:SS"
   */
  static async getSalesByManagerGroupedByPartners({
    managerId,
    startDate,
    endDate,
  }: {
    managerId: string;
    startDate: string;
    endDate: string;
  }) {
    return getSpecificODataResponse({
      path: `AccumulationRegister_ВыручкаИСебестоимостьПродаж/Turnovers(EndPeriod=datetime'${endDate}',StartPeriod=datetime'${startDate}',Dimensions='Менеджер,АналитикаУчетаПоПартнерам')`,
      select:
        "КоличествоTurnover,СуммаВыручкиTurnover,СуммаВыручкиБезНДСTurnover,СуммаАвтоматическойСкидкиTurnover,АналитикаУчетаПоПартнерам/Партнер_Key,АналитикаУчетаПоПартнерам/Контрагент,АналитикаУчетаПоПартнерам/Description",
      filter: `Менеджер_Key eq guid'${managerId}'`,
      expand: "АналитикаУчетаПоПартнерам",
      orderBy: "СуммаВыручкиTurnover desc",
    }) as Promise<ISalesByPartnersFields[]>;
  }

  /**
   *
   * @param managerId - guid
   * @param startDate - has to be a string formatted as "YYYY-MM-DDTHH:MM:SS"
   * @param endDate - has to be a string formatted as "YYYY-MM-DDTHH:MM:SS"
   */
  static async getSalesByManagerGroupedByNomenclature({
    managerId,
    startDate,
    endDate,
  }: {
    managerId: string;
    startDate: string;
    endDate: string;
  }) {
    return getSpecificODataResponse({
      path: `AccumulationRegister_ВыручкаИСебестоимостьПродаж/Turnovers(EndPeriod=datetime'${endDate}',StartPeriod=datetime'${startDate}',Dimensions='Менеджер,АналитикаУчетаНоменклатуры')`,
      select:
        "КоличествоTurnover,СуммаВыручкиTurnover,СуммаВыручкиБезНДСTurnover,СуммаАвтоматическойСкидкиTurnover,АналитикаУчетаНоменклатуры/Номенклатура_Key,АналитикаУчетаНоменклатуры/Склад,АналитикаУчетаНоменклатуры/Description",
      filter: `Менеджер_Key eq guid'${managerId}'`,
      expand: "АналитикаУчетаНоменклатуры",
      orderBy: "СуммаВыручкиTurnover desc",
    }) as Promise<ISalesByNomenclatureFields[]>;
  }

  /**
   *
   * @param managerId - guid
   * @param startDate - has to be a string formatted as "YYYY-MM-DDTHH:MM:SS"
   * @param endDate - has to be a string formatted as "YYYY-MM-DDTHH:MM:SS"
   */
  static async getSalesByManagerGroupedByPartnerAndNomenclature({
    managerId,
    startDate,
    endDate,
  }: {
    managerId: string;
    startDate: string;
    endDate: string;
  }) {
    return getSpecificODataResponse({
      path: `AccumulationRegister_ВыручкаИСебестоимостьПродаж/Turnovers(EndPeriod=datetime'${endDate}',StartPeriod=datetime'${startDate}',Dimensions='Менеджер,АналитикаУчетаПоПартнерам,АналитикаУчетаНоменклатуры'')`,
      select:
        "КоличествоTurnover,СуммаВыручкиTurnover,СуммаВыручкиБезНДСTurnover,СуммаАвтоматическойСкидкиTurnover,АналитикаУчетаНоменклатуры/Номенклатура_Key,АналитикаУчетаНоменклатуры/Склад,АналитикаУчетаНоменклатуры/Description,АналитикаУчетаПоПартнерам/Партнер_Key,АналитикаУчетаПоПартнерам/Контрагент,АналитикаУчетаПоПартнерам/Description",
      filter: `Менеджер_Key eq guid'${managerId}'`,
      expand: "АналитикаУчетаНоменклатуры,АналитикаУчетаПоПартнерам",
      orderBy: "СуммаВыручкиTurnover desc",
    }) as Promise<ISalesByPartnersAndNomenclatureFields[]>;
  }

  static async getAllUsers(): Promise<IUserFields[]> {
    return getSpecificODataResponse({
      path: "Catalog_Пользователи",
      select:
        "Ref_Key,DataVersion,DeletionMark,Description,Недействителен,ДополнительныеРеквизиты/Свойство_Key,ДополнительныеРеквизиты/Значение,ФизическоеЛицо/Ref_Key,ФизическоеЛицо/DeletionMark,ФизическоеЛицо/Description,ФизическоеЛицо/ДатаРождения,ФизическоеЛицо/ИНН,ФизическоеЛицо/КонтактнаяИнформация/Тип,ФизическоеЛицо/КонтактнаяИнформация/Представление",
      expand: "ФизическоеЛицо",
    }) as Promise<IUserFields[]>;
  }
}