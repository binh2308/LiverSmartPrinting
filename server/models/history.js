import mongoose from "mongoose";

const Schema = mongoose.Schema;

const printInfoSchema = new Schema({
    fileName: {
        type: String, // Tên file cần in
        required: true,
    },
    noCopy: {
        type: Number, // Số lượng bản sao
        required: true,
        min: 1, // Giá trị tối thiểu là 1
    },
    colorMode: {
        type: String,
        enum: ['as-a-printer', 'black-white', 'color'],
        default: 'as-a-printer',
    },
    orientation: {
        type: String, // Hướng giấy in: theo tài liệu hoặc ngang (landscape) hoặc dọc (portrait)
        enum: ['as-in-document', 'portrait', 'landscape'],
        default: 'as-in-document',
    },
    multiplePage: {
        type: Number, // Số lượng trang in trên một tờ giấy
        default: 1,
    },
    size: {
        type: String, // Kích thước giấy in
        enum: ['A5', 'A4', 'A3', 'A2', 'A1', 'A0'],
        default: 'A4',
    },
    pageRange: {
        type: String, // Phạm vi trang in, ví dụ: "1-5", "2,4,6"
        default: 'all', // Nếu không chỉ định, in tất cả các trang
    },
    side: {
        type: String, // Số lượng mặt in
        enum: ['one', 'both'],
        default: 'one',
    },
    time: {
        type: Date, // Thời gian yêu cầu in
        default: Date.now,
    },
});

const HistorySchema = new Schema({
    printInfo: {
        type: [printInfoSchema],
        default: []
    },
    userId: {
        type: String,
        required: true, 
    },
    printerId: {
        type: String,
        required: true, 
    }
});

const History = mongoose.model('histories', HistorySchema);

export default History;