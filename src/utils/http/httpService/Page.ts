export interface IPageService {
    pageSize?: number
    pageIndex?: number
    total?: number
    pageSizeOpts?: string[]
}

export class PageService {
    public default: IPageService = {
        pageSize: 100,
        pageIndex: 1,
        total: 0,
        pageSizeOpts: ['10', '20', '50', '100', '500', '1000'],
    }

    constructor(data?: any) {
        if (data) this.default = { ...this.default, ...data }
    }

    public setPage(obj: IPageService) {
        const { pageSize, pageIndex, total } = obj
        this.default.pageSize = pageSize
        this.default.pageIndex = pageIndex
        this.default.total = total
    }

    public getPage(): IPageService {
        return this.default
    }
}
