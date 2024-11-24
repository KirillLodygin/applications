export type userType = {
    username: string,
    password: string
}

export type userDataType = {
    key: string,
    employee_id: string
}

export type headerCellType = {
    field: string,
    label: string
}

export type tableHeadersDataType = Array<headerCellType>

export type tableDataStringType = Record<string, string>

export type tableDataType = Array<tableDataStringType>

export type sortDirectionType = 'asc' | 'desc' | 'none'

export type pageSizeSelectOptionType = {
    label: string
    value: string
}

export type pageSizeSelectOptionsType = Array<pageSizeSelectOptionType>

export type addressSelectOptionType = {
    value: string,
    label: string
}

export type addressSelectOptionsType = Array<addressSelectOptionType>

export type apartmentSelectionOptionType = {
    value: number,
    label: string
}

export type apartmentSelectionOptionsType = Array<apartmentSelectionOptionType>