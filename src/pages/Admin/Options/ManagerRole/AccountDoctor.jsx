// import { useEffect, useState } from "react";
// import { Table, Select, Avatar, Input, Modal, Form, DatePicker, Upload, message, Spin } from "antd";
// import classes from "./AccountDoctor.module.scss";
// import Constants from "../../../../utils/constants";
// import { toast } from "react-toastify";
// import DropdownOperation from "../../../../components/Dropdown/DropdownOperation";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { storage } from "../../../../firebase";
// import { v4 } from "uuid";
// import Factories from "../../../../services/FactoryApi";
// import { ToastNoti, ToastNotiError } from "../../../../utils/Utils";
// import { LoadingOutlined, MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
// import ButtonCustom from "../../../../components/Button/ButtonCustom";
// import dayjs from "dayjs";
// import { Button } from "@mui/material";

// const getBase64 = (img, callback) => {
//   const reader = new FileReader();
//   reader.addEventListener('load', () => callback(reader.result));
//   reader.readAsDataURL(img);
// };
// const beforeUpload = (file) => {
//   const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
//   if (!isJpgOrPng) {
//     message.error('You can only upload JPG/PNG file!');
//   }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error('Image must smaller than 2MB!');
//   }
//   return isJpgOrPng && isLt2M;
// };

// const ManagerRole = () => {
//   const [dataList, setDataList] = useState([]);
//   const [dataListBranch, setDataListBranch] = useState([]);
//   const [valueSearch, setValueSearch] = useState();
//   const [loading, setLoading] = useState(false);

//   const fetchData = async (value) => {
//     setLoading(true)
//     try {
//       const response = await Factories.getAccountList(value, 2);
//       if (response) {
//         setDataList(response);
//       } else {
//         toast.error('Hệ thống lỗi')
//         console.error("API response does not contain expected data:", response);
//       }
//       setLoading(false)
//     } catch (error) {
//       toast.error('Hệ thống lỗi')
//       setLoading(false)
//     }
//   };

//   const fetchDataBranch = async (keyword) => {
//     try {
//       const response = await Factories.getBranchList(keyword);
//       if (response) {
//         const newDate = response?.map(item => ({
//           value: item._id,
//           label: item.name,
//         }))
//         setDataListBranch(newDate);
//       }
//     } catch (error) {
//       ToastNotiError(error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchDataBranch()
//   }, []);

//   function handleReload() {
//     fetchData();
//   }

//   function handleSearch() {
//     fetchData(valueSearch)
//   }
//   const handleKeyDown = (event) => {
//     if (event.key === "Enter" || event.keyCode === 13) {
//       fetchData(valueSearch);
//     }
//   };


//   const columns = [
//     {
//       title: '#',
//       dataIndex: 'id',
//       key: 'id',
//       width: 50,
//       fixed: 'left',
//       align: 'center',
//       render: (id, record, index) => { ++index; return index; },
//       showSorterTooltip: false,
//     },
//     {
//       title: 'Email',
//       width: 140,
//       dataIndex: 'email',
//       key: 'name',
//       fixed: 'left',
//     },
//     {
//       title: 'Họ và Tên',
//       width: 140,
//       dataIndex: 'fullName',
//       key: 'name',
//       fixed: 'left',
//     },
//     {
//       title: 'Giớt tính',
//       dataIndex: 'gender',
//       key: 'gender',
//       width: 110,
//       render: (data) => <div>
//         {Constants.optionSex.find(item => item.value === data)?.label}
//       </div>,
//     },
//     {
//       title: 'Tuổi',
//       dataIndex: 'age',
//       key: 'age',
//       width: 70,
//       align: 'center',
//       sorter: (a, b) => a.age - b.age,
//     },
//     {
//       title: 'SĐT',
//       dataIndex: 'phone',
//       width: 130,
//       key: 'phone',
//     },
//     {
//       title: 'Cấp bậc',
//       dataIndex: 'academicRank',
//       key: 'department',
//       width: 150,
//       render: (text) =>
//         <Select
//           style={{
//             width: "100%",
//           }}
//           disabled
//           value={parseInt(text)}
//           options={Constants.levelDoctor}
//         />
//     },
//     // {
//     //   title: 'Tỷ lệ',
//     //   width: 160,
//     //   dataIndex: 'rate',
//     //   key: '7',
//     //   // defaultSortOrder: 'descend',
//     //   sorter: (a, b) => a.rateDone - b.rateDone,
//     // },
//     // {
//     //   title: 'Đánh giá',
//     //   dataIndex: 'star',
//     //   width: 140,
//     //   // key: '7',
//     //   defaultSortOrder: 'star',
//     //   sorter: (a, b) => a.star - b.star,
//     //   render: (star) => <StarRating starCount={star} />
//     // },
//     // {
//     //   title: 'Khoa khám',
//     //   dataIndex: 'department',
//     //   key: 'department',
//     //   width: 150,
//     // },
//     // {
//     //   title: 'Trạng thái',
//     //   dataIndex: 'status',
//     //   key: 'status',
//     //   width: 220,
//     //   filters: [
//     //     {
//     //       text: 'Đang hoạt động',
//     //       value: 1,
//     //     },
//     //     {
//     //       text: 'Khóa tài khoản',
//     //       value: 2,
//     //     },
//     //   ],
//     //   onFilter: (value, record) => record.status === value,
//     //   render: (_, data) =>
//     //     <Select
//     //       style={{
//     //         width: "100%",
//     //       }}
//     //       onChange={(value) => onChangeSelectHandler(value, data?.id)}
//     //       value={data?.status}
//     //       options={Constants.optionStatusAccount}
//     //     />
//     // },
//     {
//       title: 'Tác vụ',
//       key: 'operation',
//       width: 150,
//       align: 'center',
//       render: (_, record) => (
//         <DropdownOperation dataListBranch={dataListBranch} record={record} type={2} updateSuccess={handleReload} />
//       )
//     },
//   ];

//   const [openModalAdd, setOpenModalAdd] = useState(false)
//   const [fileUploadLink, setFileUploadLink] = useState();


//   const onOpenModalAddField = () => {
//     setOpenModalAdd(true)
//   }
//   const onCloseModalAddField = () => {
//     setOpenModalAdd(false)
//     fetchData();
//   }

//   const prefixSelector = (
//     <Form.Item name="prefix" noStyle>
//       <Select
//         style={{
//           width: 70,
//         }}
//         value={84}
//         defaultValue={"+84"}
//       >
//         <Option value="+84">+84</Option>
//         <Option value="+86">+86</Option>
//       </Select>
//     </Form.Item>
//   );

//   function handleReset() {
//     setValueSearch();
//     fetchData()
//   }


//   const formItemLayout = {
//     labelCol: {
//       xs: {
//         span: 24
//       },
//       sm: {
//         span: 6,
//       },
//     },
//     wrapperCol: {
//       xs: {
//         span: 12,
//       },
//       sm: {
//         span: 24,
//       },
//     },
//   };


//   const formItemLayoutWithOutLabel = {
//     wrapperCol: {
//       xs: {
//         span: 24,
//         offset: 0,
//       },
//       sm: {
//         span: 20,
//         offset: 6,
//       },
//     },
//   };

//   const [imageUrl, setImageUrl] = useState();
//   const handleChange = (info) => {
//     if (info.file.status === 'uploading') {
//       setLoading(true);
//       return;
//     }
//     if (info.file.status === 'done') {
//       // Get this url from response in real world.
//       getBase64(info.file.originFileObj, (url) => {
//         setLoading(false);
//         setImageUrl(url);
//       });
//     }
//   };

//   const uploadButton = (
//     <button
//       style={{
//         border: 0,
//         background: 'none',
//       }}
//       type="button"
//     >
//       {loading ? <LoadingOutlined /> : <PlusOutlined />}
//       <div
//         style={{
//           marginTop: 8,
//           border: '1px solid #111'
//         }}
//       >
//         Upload
//       </div>
//     </button>
//   );

//   const [form] = Form.useForm();
//   const onFinish = async (data) => {
//     try {
//       const response = await Factories.createDoctor(data);
//       if (response._id) {
//         ToastNoti()
//         setOpenModalAdd();
//         fetchData()
//       } else {
//         ToastNotiError(response.error)
//       }
//     } catch (error) {
//       fetchData()
//       ToastNotiError(error);
//     }
//   };
//   const onFinishFailed = () => {
//     message.error('Submit failed!');
//   };

//   const fill = () => {
//     form.setFieldsValue({
//       // name: 'Nguyễn Đặng Huy!',
//       // phone: '0358014548',
//       gender: 'Male',
//       // email: 'Huynguyen222@gmail.com',
//       date: '2001/12/12',
//       academicRank: 2,
//       dateOfBirth: dayjs('2001-04-13'),
//       specialize: ['Tim mạch', 'Nội Tim mạch'],
//       degree: ['Bằng tốt nghiệp đại học bách khoa hà nội'],
//       experience: [
//         'Tháng 7/1985-5/1987: Bác sĩ Chủ nhiệm Quân Y, Trường Cán bộ Trung cấp Quân chủng Phòng không – không quân.',
//         'Tháng 6/1987-4/2000: Bác sĩ điều trị, Khoa Phẫu thuật bụng, Bệnh viện Trung ương Quân đội 108.',
//         'Tháng 4/2000-3/2003: Chủ nhiệm khoa ngoại nhân dân, Bệnh viện Trung ương Quân đội 108, Chuyên viên Kỹ thuật Cục Quân Y – chuyên ngành phẫu thuật bụng.',
//         'Tháng 6/2003-3/2014: Chủ nhiệm Khoa Ngoại Tổng hợp (B15) Bệnh viện Trung ương Quân đội 108, Giám đốc Trung tâm Phẫu thuật Nội soi, Giảng viên bộ môn Ngoại tiêu hóa Viện nghiên cứu Y Dược lâm sàng 108, Chuyên viên kỹ thuật Cục Quân Y – chuyên ngành Phẫu thuật bụng.',
//         'Tháng 3/2014-6/2015: Phó chủ nhiệm Bộ môn Ngoại Tiêu hóa Viện nghiên cứu Y Dược lâm sàng 108, Chuyên viên Kỹ thuật Cục Quân Y – chuyên ngành Phẫu thuật bụng.',
//         'Tháng 6/2015-7/2018: Viện trưởng Viện phẫu thuật tiêu hóa kiêm chủ nhiệm khoa Phẫu thuật Gan mật tụy, Phó chủ nhiệm Bộ môn Ngoại tiêu hóa Viện nghiên cứu Y Dược lâm sàng 108.'
//       ],
//       // introduction: ,
//     });
//   }

//   useEffect(() => { fill() }, [])
//   return (
//     <>
//       <Modal
//         width={800}
//         title="Thêm bác sĩ mới"
//         open={openModalAdd}
//         onCancel={onCloseModalAddField}
//         footer={[]}
//       >
//         <Form
//           {...formItemLayout}
//           variant="filled"
//           onFinishFailed={onFinishFailed}
//           form={form}
//           onFinish={onFinish}
//         >

//           <div className="flex md:flex-row gap-10">
//             <div className="flex md:w-full mt-4 flex-col gap-2">

//               <Form.Item
//                 label="Họ và tên"
//                 name="fullName"
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Bắt buộc nhập!',
//                   },
//                 ]}
//               >
//                 <Input />
//               </Form.Item>

//               <Form.Item
//                 name="phone"
//                 label="Số điện thoại"
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Bắt buộc nhập!',
//                   },
//                 ]}
//               >
//                 <Input
//                   addonBefore={prefixSelector}
//                   style={{
//                     width: '100%',
//                   }}
//                 />
//               </Form.Item>

//               <Form.Item
//                 label="Email"
//                 name="email"
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Bắt buộc nhập!',
//                   },
//                   {
//                     type: 'email',
//                   },
//                 ]}
//               >
//                 <Input type="email" />
//               </Form.Item>



//               <Form.Item
//                 name="gender"
//                 label="Giới tính"
//                 defaultvalue={'Male'}
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Chọn giới tính',
//                   },
//                 ]}
//               >
//                 <Select placeholder="Chọn giới tính">
//                   <Option value="Male">Nam</Option>
//                   <Option value="Female">Nữ</Option>
//                   <Option value="Other">Khác</Option>
//                 </Select>
//               </Form.Item>

//               <Form.Item
//                 label="Ngày sinh"
//                 name="dateOfBirth"
//               >
//                 <DatePicker placeholder="yyyy/mm/dd" />
//               </Form.Item>


//               <Form.Item
//                 label="Nơi làm việc"
//                 name="branchId"
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Bắt buộc nhập!',
//                   },
//                 ]}
//               >
//                 <Select
//                   placeholder="Chọn nơi làm việc " options={dataListBranch} />
//               </Form.Item>

//               <Form.Item
//                 label="Quyền truy cập"
//                 name="academicRank"
//                 rules={[
//                   {
//                     required: true,
//                     message: 'Bắt buộc nhập!',
//                   },
//                 ]}
//               >
//                 <Select placeholder="Chọn quyền truy cập" options={Constants.levelRole} />
//               </Form.Item>

//             </div>
//             <div className="flex">
//               <Upload
//                 name="avatar"
//                 listType="picture-circle"
//                 className="avatar-uploader"
//                 showUploadList={false}
//                 action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
//                 beforeUpload={beforeUpload}
//                 onChange={handleChange}
//               >
//                 {imageUrl ? (
//                   <img
//                     src={imageUrl}
//                     alt="avatar"
//                     style={{
//                       width: '100%',
//                     }}
//                   />
//                 ) : (
//                   uploadButton
//                 )}
//               </Upload>
//             </div>
//           </div>
//           <Form.Item
//             wrapperCol={{
//               offset: 20,
//               span: 24,
//             }}
//           >
//             <ButtonCustom
//               type='submit'
//               htmlType="submit"
//             >
//               Lưu thông tin
//             </ButtonCustom>
//           </Form.Item>

//         </Form>
//       </Modal >
//       <div className={classes["admin-user-container"]}>
//         <div className={classes["header"]}>
//           <div className={classes["titleTable"]}>
//             <span className="text-3xl uppercase  font-bold text-blue">Danh sách tài khoản</span>
//           </div>
//         </div>
//         <div className="bg-[#fff] flex flex-row justify-between rounded-lg p-5 gap-20 w-full">
//           <Input
//             placeholder="Tìm kiếm theo tên"
//             size="middle "
//             value={valueSearch}
//             className='w-[40%]'
//             onKeyDown={(e) => handleKeyDown(e)}
//             onChange={(e) => setValueSearch(e.target.value)}
//           />
//           <div className="flex flex-row gap-3">
//             <Button
//               variant="contained"
//               className="ml-10"
//               onClick={handleReset}
//             >
//               Mặc định
//             </Button>
//             <Button
//               className="ml-2 bg-blue text-[#fff]"
//               variant="contained"
//               onClick={handleSearch}
//             >
//               Tìm kiếm
//             </Button>
//             <Button
//               className="ml-2 bg-blue text-[#fff]"
//               variant="contained"
//               onClick={onOpenModalAddField} >Thêm tài khoản</Button>
//           </div>

//         </div>
//         <div className={classes["rowContent"]}>
//           {loading ? <Spin></Spin> :
//             <Table
//               columns={columns}
//               dataSource={dataList ?? []}
//             />
//           }

//         </div>
//       </div >
//     </>
//   );
// };

// export default ManagerRole;
