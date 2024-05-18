import React, { useEffect, useState } from "react";
import { Select, Table, Input, Modal, Typography, Button, Avatar } from "antd";
import classes from './Fields.module.css'
import CategoriesFactories from "../../../../services/CategoriesFatories";
import { ToastNoti, ToastNotiError } from "../../../../utils/Utils";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../../../../firebase.jsx";
import { v4 } from 'uuid';
import ReactBigCalendar from "../../../../components/Calendar/Calendar.jsx";
import Factories from "../../../../services/FactoryApi.js";

const { Text } = Typography;

const Fields = () => {
    const [listBranches, setListBranches] = useState()
    const [searchBR, setSearchBR] = useState("");
    const [openModalAdd, setOpenModalAdd] = useState(false)
    const [categoryAddName, setCategoryAddName] = useState()
    const [categoryUpdateId, setCategoryUpdateId] = useState()

    const [categoryUpdateName, setCategoryUpdateName] = useState()
    const [categoryUpdateImage, setcategotyUpdateImage] = useState()
    const [error, setError] = useState();
    const [showModalUpdate, setShowModalUpdate] = useState();

    const fetchData = async () => {
        const response = await Factories.getBranchList();
        const branchList = response?.map(item => ({
            value: item._id,
            text: item.name,
            label: item.name,

        }))
        setListBranches(branchList);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        {
            title: '#',
            dataIndex: 'id',
            key: 'id',
            width: 50,
            align: 'center',
            render: (id, record, index) => { ++index; return index; },
            showSorterTooltip: false,
        },
        {
            title: "Tên Lĩnh vực",
            dataIndex: "name",
            key: "name",
            render: (text, data) => <div className="name-title-table">{text}</div>,
        },
        {
            title: "Tác vụ",
            key: "action",
            render: (_, record) => (
                <div className="btn-action-group" >
                    <Button
                        style={{ marginRight: 10 }}
                        onClick={() => onDeleteFiledHandler(record?.id)}
                    >
                        Xóa
                    </Button>
                    <Button
                        onClick={() => onUpdateCategory(record)}
                    >
                        Sửa
                    </Button>
                </div>
            ),
        },
    ];

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.keyCode === 13) {
            // fetchData(searchBR);
        }
    };
    function handleReset() {
        setSearchBR();
        fetchData();
    }
    function handleSearch() {
        fetchData(searchBR);
    }
    const handleOnChangeInput = (event) => {
        setSearchBR(event.target.value);
    }

    const onDeleteFiledHandler = async (id) => {
        try {
            const resp = await CategoriesFactories.deleteCategory(id);
            if (resp.status) {
                ToastNoti();
                fetchData();
            }
        } catch (error) {
            ToastNotiError();
        }
    }


    const onUpdateCategory = (data) => {
        setCategoryUpdateName(data?.name)
        setCategoryUpdateId(data?.id)
        setcategotyUpdateImage(data?.image)
        setShowModalUpdate(true);
    }
    const onCloseModalUpdate = (id) => {
        setShowModalUpdate(false);
        setCategoryUpdateId();
        fetchData();
    }
    const onOpenModalAddField = () => {
        setOpenModalAdd(true)
        setFileUploadLink();
    }

    const onCloseModalAddField = () => {
        setOpenModalAdd(false)
        setFileUploadLink();
        fetchData();
    }

    const onChangeDataAddField = (event) => {
        setError()
        setCategoryAddName(event.target.value)
    }

    const onChangeDataUpdateField = (event) => {
        setCategoryUpdateName(event.target.value);
    }


    const onAddCategorySubmit = async () => {
        if (!categoryAddName || categoryAddName?.trim() === '') {
            setError("Điền tên lĩnh vực")
        }
        else {
            setError();
            const data = {
                name: categoryAddName,
                image: fileUploadLink,
            }
            try {
                const resp = await CategoriesFactories.createCategory(data);
                if (resp?.status === 200) {
                    ToastNoti();
                    onCloseModalAddField()
                } else {
                    ToastNotiError('resp?.message');
                }
            } catch (error) {
                ToastNotiError();
            }
        }
    }

    const onUpdateCategorySubmit = async () => {
        if (!categoryUpdateName || categoryUpdateName?.trim() === '') {
            setError("Điền tên lĩnh vực")
        }
        else {
            setError();
            const data = {
                name: categoryUpdateName,
                image: fileUploadLink ? fileUploadLink : categoryUpdateImage,
            }
            try {
                const resp = await CategoriesFactories.updateCategory(categoryUpdateId, data);
                if (resp?.status === 200) {
                    ToastNoti();
                    onCloseModalUpdate()
                } else {
                    ToastNotiError('resp?.message');
                }
            } catch (error) {
                ToastNotiError();
            }
        }
    }

    const [fileUploadLink, setFileUploadLink] = useState();


    function handleChangeImage(file) {
        if (file === null || !file) {
            console.log('No file selected.');
            return;
        }
        const uniqueFileName = `${file.name}_${v4()}`;
        const imageRef = ref(storage, `avatar/${uniqueFileName}`);
        uploadBytes(imageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((downloadURL) => {
                setFileUploadLink(downloadURL)
            });
        }).catch((error) => {
            console.error('Error uploading file:', error);
        });
    }
    return (
        <div className="booking-container" style={{ height: '100vh', overflow: 'scroll' }}>
            <div className="booking-title"><span className="uppercase text-3xl">Lịch khám bác sĩ</span></div>
            <div className="booking-search">
                <Select
                    placeholder="Chọn bệnh viện"
                    size="middle "
                    // value={''}
                    options={listBranches ?? []}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={(e) => handleOnChangeInput(e)}
                    style={{ width: '20%' }}
                />
                <Button
                    type='default'
                    onClick={handleReset}
                >
                    Mặc định
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </Button>
                <Button variant="contained" onClick={onOpenModalAddField} >Thêm lĩnh vực</Button>
            </div>
            <div className=" bg-[#fff] w-full p-6 rounded-xl h-[120vh]">
                <ReactBigCalendar />

                {/* <Table
                    columns={columns}
                    dataSource={fields ?? []}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ["1", "5", "10", "20"],
                    }}
                /> */}
            </div>
            <Modal
                width={800}
                title="Thêm lĩnh vực"
                open={openModalAdd}
                onCancel={onCloseModalAddField}
                footer={[]}
            >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <label style={{ padding: '2px 5px', border: '1px solid #FAF8F1', borderRadius: 5 }} htmlFor="uploadInput" className={classes.uploadButton}>
                            Upload Image
                        </label>
                        <input
                            id="uploadInput"
                            type="file"
                            className={classes.uploadInput}
                            style={{ display: 'none' }}
                            onChange={(e) => handleChangeImage(e.target.files[0])}
                        />
                    </div>
                    <Avatar
                        src={fileUploadLink ?? ''}
                        alt="avatar"
                        style={{ width: 200, height: 200 }}
                    />

                    <div style={{ display: 'flex', margin: '10px 0px', flexDirection: 'row' }}>
                        <Input
                            type="text"
                            style={{ width: '100%' }}
                            placeholder="Nhập tên lĩnh vực"
                            className={classes['add-modal-input']}
                            onChange={onChangeDataAddField}
                            name="name"
                        />
                    </div>
                    {error && <Text type="danger">{error}</Text>}
                    <Button variant="contained" style={{ width: '100%', float: 'right' }} onClick={onAddCategorySubmit}>Thêm</Button>
                </div>
            </Modal >

            <Modal
                width={800}
                title="Sửa thông tin lĩnh vực"
                open={showModalUpdate}
                onCancel={onCloseModalUpdate}
                footer={[]}
            >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                        <label style={{ padding: '2px 5px', border: '1px solid #FAF8F1', borderRadius: 5 }} htmlFor="uploadInput" className={classes.uploadButton}>
                            Upload Image
                        </label>
                        <input
                            id="uploadInput"
                            type="file"
                            className={classes.uploadInput}
                            style={{ display: 'none' }}
                            onChange={(e) => handleChangeImage(e.target.files[0])}
                        />
                    </div>
                    <Avatar
                        src={fileUploadLink ? fileUploadLink : categoryUpdateImage}
                        alt="avatar"
                        style={{ width: 200, height: 200 }}
                    />
                    <div style={{ display: 'flex', margin: '10px 0px', flexDirection: 'row' }}>
                        <Input
                            type="text"
                            style={{ width: '100%' }}
                            placeholder="Nhập tên lĩnh vực"
                            className={classes['add-modal-input']}
                            onChange={onChangeDataUpdateField}
                            value={categoryUpdateName}
                            name="name"
                        />
                    </div>
                    {error && <Text type="danger">{error}</Text>}
                    <Button variant="contained" style={{ width: '100%', float: 'right' }} onClick={onUpdateCategorySubmit}>Thêm</Button>
                </div>
            </Modal >

        </div >
    )
}
export default Fields