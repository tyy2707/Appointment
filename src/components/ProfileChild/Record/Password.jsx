import { useContext, useState } from 'react';
import { Input, Button, message } from 'antd';
import Factories from '../../../services/FactoryApi';
import { ToastNoti, ToastNotiError } from '../../../utils/Utils';
import { AuthContext } from '../../../context/auth.context';

const PasswordPage = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { user } = useContext(AuthContext);

    const handlePasswordChange = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            message.error('Nhập tất cả dữ liệu.');
            return;
        }
        if (newPassword !== confirmPassword) {
            message.error('Nhập lại mật khẩu không đúng.');
            return;
        }
        try {
            // await Auth.changePassword(user, oldPassword, newPassword);
            try {
                const data = {
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }
                const response = await Factories.updatePass(user.id, data);
                ToastNoti(response?.message)
                setNewPassword()
                setOldPassword()
                setConfirmPassword()
            } catch (error) {
                ToastNotiError(error?.response?.data.message);
            }
        } catch (error) {
        }
    };

    return (
        <div className='flex ' style={{ minWidth: 900, margin: 'auto' }}>
            <div className='w-[320px]'>
                <h2 style={{ marginBottom: 16 }}>Đổi mật khẩu</h2>
                <Input.Password
                    placeholder="Mật khẩu cũ"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    style={{ marginBottom: 16 }}
                />
                <Input.Password
                    placeholder="Mật khẩu mới"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    style={{ marginBottom: 16 }}
                />
                <Input.Password
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    style={{ marginBottom: 16 }}
                />
                <Button type="primary" onClick={handlePasswordChange}>Lưu mật khẩu</Button>
            </div>

        </div>
    );
};

export default PasswordPage;
