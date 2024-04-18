export interface ITask{
    id?: number;    
    description: string,
    // done: boolean,
    dueDate: Date;
    item: string;
    userId: string;
    status: string;
    [key: string]: any;
    

}