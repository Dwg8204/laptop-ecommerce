const Slider = require('../models/sliderModel');

const sliderController = {
    // API Lấy danh sách Slider (GET)
    getAllSliders: async (req, res) => {
        try {
            const sliders = await Slider.getAll();
            res.status(200).json({ 
                success: true, 
                message: 'Lấy dữ liệu thành công',
                data: sliders 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }
    },

    // API Thêm mới Slider (POST)
    createSlider: async (req, res) => {
        try {
            // Lấy dữ liệu từ Frontend gửi lên (body)
            const { title, image_url } = req.body;

            // Kiểm tra các trường bắt buộc
            if (!title || !image_url) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Thiếu thông tin bắt buộc: title hoặc image_url' 
                });
            }

            // Gọi Model để lưu vào Database
            const newId = await Slider.create(req.body);

            res.status(201).json({ 
                success: true, 
                message: 'Thêm Slider mới thành công!',
                data: { id: newId, ...req.body }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi thêm Slider' });
        }
    }
};

module.exports = sliderController;
