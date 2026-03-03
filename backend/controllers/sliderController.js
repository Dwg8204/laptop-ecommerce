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

    //API Lấy chi tiết Slider theo ID (GET)
    getSliderById: async (req, res) => {
        try {
            const {id} = req.params;
            const slider = await Slider.getById(id);
            if (!slider) {
                return res.status(404).json({ success: false, message: 'Slider không tồn tại!' });
            }
            res.status(200).json({ 
                success: true, 
                message: 'Lấy dữ liệu thành công',
                data: slider 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ' });
        }

    },

    // API Thêm mới Slider (POST)
    createSlider: async (req, res) => {
        try {
            const { title, link_url, display_order, status } = req.body;
            
            // req.file chính là file ảnh mà multer vừa lưu xong
            if (!req.file) {
                return res.status(400).json({ success: false, message: 'Vui lòng upload ảnh banner!' });
            }

            // Tạo đường dẫn URL cho ảnh (Ví dụ: /uploads/sliders/image-12345.jpg)
            // const image_url = `/uploads/sliders/${req.file.filename}`;
            const image_url = req.file.path; // Đây là URL trả về từ Cloudinary sau khi upload thành công
            // Tạo cục data để gửi cho Model
            const sliderData = {
                title,
                image_url, // Gắn cái URL vừa tạo vào Database
                link_url,
                display_order,
                status,
                creator_id: null // Tạm thời để null vì chưa làm đăng nhập Admin
            };

            const newId = await Slider.create(sliderData); // Gọi hàm ở file Model (không cần sửa file Model)

            res.status(201).json({ 
                success: true, 
                message: 'Thêm Slider và upload ảnh thành công!',
                data: { id: newId, image_url }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi thêm Slider' });
        }
    },

    //API Cập nhật Slider (PUT)
    updateSlider: async (req, res) => {
        try {
            const { id } = req.params;
            const existingSlider = await Slider.getById(id);
            if (!existingSlider) {
                return res.status(404).json({ success: false, message: 'Slider không tồn tại!' });
            }
            const updateData = { ...req.body };
            if (req.file) {
                updateData.image_url = req.file.path; // Cập nhật URL mới nếu có upload ảnh mới
            }
            const affectedRows = await Slider.update(id, updateData);
            if (affectedRows === 0) {
                return res.status(400).json({ success: false, message: 'Không có trường nào được cập nhật!' });
            }

            res.status(200).json({ 
                success: true, 
                message: 'Cập nhật Slider thành công!'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Lỗi khi cập nhật Slider' });

        }
    }

};

module.exports = sliderController;