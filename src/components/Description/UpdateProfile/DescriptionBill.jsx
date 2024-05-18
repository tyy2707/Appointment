/* eslint-disable react/prop-types */
import Box from '../../Box/Box';
import { Typography } from 'antd';
import { useForm } from 'react-hook-form';
import { Button } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Constants from '../../../utils/constants';
import axios from 'axios'
import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDistricts, getProvinces, getWards } from '../../../utils/Location/location';
import Factories from '../../../services/FactoryApi';
import { ToastNoti, ToastNotiError, getDate } from '../../../utils/Utils';
import { AuthContext } from '../../../context/auth.context';
const { Title } = Typography;
const UpdateProfile = ({ data }) => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const { user } = useContext(AuthContext);

    const navigate = useNavigate()
    const watchProvince = watch('province')
    const [loading, setLoading] = useState()
    const watchDistrict = watch('district')
    const [provincesList, setProvincesList] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const onSubmit = (value) => {
        setLoading(true);
        if (!data?._id) {
            savePatient(value);
        } else {
            updatePatient(value);
        }
        setLoading(false)
    };
    async function savePatient(value) {
        const response = await Factories.createPatient(value);
        if (response?._id) {
            ToastNoti()
            navigate('/user?key=records')
        }
        if (response?.error) {
            ToastNotiError(response?.error)
        }
    }
    async function updatePatient(value) {
        const response = await Factories.updatePatient(value);
        if (response?._id) {
            ToastNoti()
            navigate('/user?key=records')
        }
        if (response?.error) {
            ToastNotiError(response?.error)
        }
    }
    useEffect(() => {
        setValue('userId', user?.id)
    }, [user])
    useEffect(() => {
        if (data) {
            setValue('fullName', data?.fullName)
            setValue('_id', data?._id)
            setValue('dateOfBirth', getDate(data?.dateOfBirth, 2))
            setValue('phone', data?.phone)
            setValue('gender', data?.gender)
            setValue('job', data?.job)
            setValue('CCCD', data?.CCCD)
            setValue('email', data?.email)
            setValue('age', data?.age)
            setValue('nation', data?.nation)
            setValue('province', data?.province)
            setValue('district', data?.district)
            setValue('ward', data?.wards)
            setValue('address', data?.address)
        }
    }, [data])
    useEffect(() => {
        async function fetchData() {
            try {
                const provinces = await getProvinces();
                setProvincesList(provinces);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchDataDistrict() {
            try {
                const list = await getWards(watchDistrict);
                setWards(list);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        }
        fetchDataDistrict();
    }, [watchDistrict]);

    useEffect(() => {
        async function fetchDataDistrict() {
            try {
                const districtList = await getDistricts(watchProvince);
                setDistricts(districtList);
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        }
        fetchDataDistrict();
    }, [watchProvince]);


    return (
        <div className='flex flex-col justify-start  gap-2'>
            <Box
                description={'Vui lòng cung cấp thông tin chính xác để được phục vụ tốt nhất. Trong trường hợp cung cấp sai thông tin bệnh nhân & điện thoại, việc xác nhận cuộc hẹn sẽ không hiệu lực trước khi đặt khám.'}
            />
            <span className='text-red text-xl '>(*) Thông tin bắt buộc nhập</span>
            <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-row gap-10 justify-between">
                    <div className='w-1/2'>
                        <Title level={4}>Họ và tên (có dấu)*</Title>
                        <input
                            type="text"
                            placeholder="Hoàng Văn A"
                            className="w-full border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent"
                            {...register('fullName', { required: true })}
                        />
                        {errors.fullName && <span className="text-red">Bắt buộc nhập thông tin</span>}
                    </div>
                    <div className='w-1/2'>
                        <Title level={4}>Ngày sinh *</Title>
                        <input
                            type="date"
                            placeholder="mm/dd/yyyy"
                            className="w-full border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent"
                            {...register('dateOfBirth', { required: true })}
                        />
                        {errors.dob && <span className="text-red">Bắt buộc nhập thông tin</span>}
                    </div>
                </div>
                <div className="flex flex-row gap-10 justify-between">
                    <div className='w-1/2'>
                        <Title level={4}>Số điện thoại *</Title>
                        <input
                            type="tel" id="phone"
                            placeholder="09202020201"
                            className="w-full border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent"
                            {...register('phone', { required: true })}
                        />
                        {errors.phone && <span className="text-red">Bắt buộc nhập thông tin</span>}
                    </div>
                    <div className='w-1/2'>
                        <Title level={4}>Giới tính*</Title>
                        <select
                            type="text"
                            {...register('gender', { required: true })}
                            className="w-full border border-slate-200 rounded-lg py-3 px-3 outline-none  bg-transparent"
                        >
                            <option className='rounded-sm' value="">Chọn giới tính</option>
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                        </select>
                        {errors.gender && <span className="text-red">Bắt buộc nhập thông tin</span>}
                    </div>
                </div>

                <div className="flex flex-row gap-10 justify-between">
                    <div className='w-1/2'>
                        <Title level={4}>Nghề nghiệp *</Title>
                        <input
                            type="text"
                            placeholder="Nhập nghề nhiệp"
                            className="w-full border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent"
                            {...register('job', { required: true })}
                        />
                        {errors.job && <span className="text-red">Bắt buộc nhập thông tin</span>}
                    </div>
                    <div className='w-1/2'>
                        <Title level={4}>Số CMND/CCCD *</Title>
                        <input
                            type="number"
                            placeholder="Nhập số CMND/CCCD"
                            className="w-full border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent"
                            {...register('CCCD', { required: true })}
                        />
                        {errors.CCCD && <span className="text-red">Bắt buộc nhập thông tin</span>}
                    </div>
                </div>
                <div className="flex flex-row w-full justify-between">
                    <div style={{ width: 'calc( 50% - 20px' }}>
                        <Title level={4}>Tuổi *</Title>
                        <input
                            type="number"
                            placeholder="Nhập tuổi"
                            className="w-full border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent"
                            {...register('age', { required: true })}
                        />
                        {errors.age && <span className="text-red">Bắt buộc nhập thông tin</span>}
                    </div>
                </div>
                <div className="flex flex-row gap-10 justify-between">
                    <div className='w-1/2'>
                        <Title level={4}>Địa chỉ email</Title>
                        <input
                            type="email"
                            placeholder="nguyenvana@gmail.com"
                            className="w-full border border-slate-200 rounded-lg py-3 px-5 outline-none  bg-transparent"
                            {...register('email',)}
                        />
                        {errors.email && <span className="text-red">Bắt buộc nhập thông tin</span>}
                    </div>
                    <div className='w-1/2'>
                        <Title level={4}>Dân tộc </Title>
                        <select
                            type="text"
                            placeholder="dd/mm/yyyy"
                            className="w-full border border-slate-200 rounded-lg py-3 px-3 outline-none  bg-transparent"
                            {...register('nation',)}
                        >
                            {Constants.nationVN?.map((item, index) => (
                                <option key={index} value={item?.value}>{item?.label}</option>
                            ))}
                        </select>
                        {errors.nation && <span className="text-red">Bắt buộc nhập thông tin</span>}
                    </div>
                </div>

                <div className="flex flex-row gap-10 justify-between">
                    <div className='w-1/2'>
                        <Title level={4}>Tỉnh / Thành</Title>
                        <select
                            type="text"
                            placeholder="Chọn tỉnh / thành phố"
                            className="w-full border border-slate-200 rounded-lg py-3 px-3 outline-none  bg-transparent"
                            {...register('province')}
                        >
                            {provincesList?.map((item, index) => (
                                <option key={index} value={item?.value}>{item?.label}</option>
                            ))}
                        </select>
                        {errors.province && <span className="text-red">Bắt buộc nhập thông tin</span>}
                    </div>
                    <div className='w-1/2'>
                        <Title level={4}>Quận / Huyện </Title>
                        <select
                            type="text"
                            placeholder="Chọn quận / huyện"
                            className="w-full border border-slate-200 rounded-lg py-3 px-3 outline-none  bg-transparent"
                            {...register('district')}
                        >
                            {districts?.map((item, index) => (
                                <option key={index} value={item?.value}>{item?.label}</option>
                            ))}
                        </select>
                        {errors.district && <span className="text-red">Bắt buộc nhập thông tin</span>}
                    </div>
                </div>

                <div className="flex flex-row gap-10 justify-between">
                    <div className='w-1/2'>
                        <Title level={4}>Phường / Xã </Title>
                        <select
                            type="text"
                            placeholder="Chọn phường / xã"
                            className="w-full border border-slate-200 rounded-lg py-3 px-3 outline-none  bg-transparent"
                            {...register('ward')}
                        >
                            {wards?.map((item, index) => (
                                <option key={index} value={item?.value}>{item?.label}</option>
                            ))}
                        </select>
                        {errors.ward && <span className="text-red">Bắt buộc nhập thông tin</span>}
                    </div>
                    <div className='w-1/2'>
                        <Title level={4}>Địa chỉ </Title>
                        <input
                            type="text"
                            placeholder="Nhập địa chỉ"
                            className="w-full border border-slate-200 rounded-lg py-3 px-3 outline-none  bg-transparent"
                            {...register('address')}
                        />
                        {errors.address && <span className="text-red">Bắt buộc nhập thông tin</span>}
                    </div>
                </div>

                <div className="flex flex-row items-end justify-between">
                    <Button
                        startIcon={<ArrowBackIosNewIcon />}
                        className='w-28' href="#text-buttons" onClick={() => navigate(-1)}>Quay lại</Button>
                    <Button type="submit" variant="contained" disabled={loading} className='w-24 float-right rounded-md'>Lưu</Button>
                </div>
            </form>
        </div>
    );
};

export default UpdateProfile;