import axios from '../axios';
import Login from './Login';
import React from 'react';
import { render, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import Admin from './Admin';
import '@testing-library/jest-dom';

jest.mock('../axios');

describe('Login Component', () => {
    beforeEach(() => {
        jest.spyOn(window, 'alert').mockImplementation(() => { });
    });

    afterEach(() => {
        window.alert.mockRestore();
    });
    it('renders the login form', () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        const emailInput = getByPlaceholderText('Please enter your email here');
        const passwordInput = getByPlaceholderText('Please enter your password here');
        const submitButton = getByText('LOG IN');
        const forgotPasswordButton = getByText('Forgot Password');

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
        expect(forgotPasswordButton).toBeInTheDocument();
    });

    it('submits the login form', async () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        const emailInput = getByPlaceholderText('Please enter your email here');
        const passwordInput = getByPlaceholderText('Please enter your password here');
        const submitButton = getByText('LOG IN');

        axios.post.mockResolvedValue({
            data: {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyQGVtYWlsLmNvbSIsInJvbGUiOiJzdHVkZW50IiwiaWF0IjoxNTg3NjE5MzQ2fQ.qC-L2bvZ1byDlUk0h9OJgKSlNrpKxBz1tO_cVZ0jKZg'
            }
        });

        fireEvent.change(emailInput, { target: { value: 'user@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('api/login', {
                email: 'user@email.com',
                pass: expect.any(String)
            });
        });
    });

    it('displays an error message when login fails', async () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        const emailInput = getByPlaceholderText('Please enter your email here');
        const passwordInput = getByPlaceholderText('Please enter your password here');
        const submitButton = getByText('LOG IN');

        axios.post.mockRejectedValue(new Error('Login failed'));

        fireEvent.change(emailInput, { target: { value: 'user@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('api/login', {
                email: 'user@email.com',
                pass: expect.any(String)
            });
            expect(window.alert).toHaveBeenCalledWith('Error:Error: Login failed');
        });
    });

    it('sends a password reset link', async () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        const emailInput = getByPlaceholderText('Please enter your email here');
        const forgotPasswordButton = getByText('Forgot Password');
        axios.post.mockResolvedValue({});

        fireEvent.change(emailInput, { target: { value: 'user@email.com' } });
        fireEvent.click(forgotPasswordButton);

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/forgot-password/link', {
                email: 'user@email.com'
            });
            expect(window.alert).toHaveBeenCalledWith('A password reset link has been sent to your email.');
        });
    });

    it('displays an error message when password reset fails', async () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        const emailInput = getByPlaceholderText('Please enter your email here');
        const forgotPasswordButton = getByText('Forgot Password');
        axios.post.mockRejectedValue(new Error('Password reset failed'));

        fireEvent.change(emailInput, { target: { value: 'user@email.com' } });
        fireEvent.click(forgotPasswordButton);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledTimes(2);
            expect(window.alert).toHaveBeenCalledWith('A password reset link has been sent to your email.');
            expect(window.alert).toHaveBeenCalledWith('Error :Error: Password reset failed');
        });
    });

    it('redirects student to the correct URL after successful login', async () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        const emailInput = getByPlaceholderText('Please enter your email here');
        const passwordInput = getByPlaceholderText('Please enter your password here');
        const submitButton = getByText('LOG IN');

        // Mock the window.location.assign function
        const assignMock = jest.fn();
        delete window.location;
        window.location = { assign: assignMock };

        axios.post.mockResolvedValue({
            data: {
                token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmVkZTU2Y2VmYzU3ZTM4ZmEzNDU5ZCIsInJvbGUiOiJzdHVkZW50IiwiZW1haWwiOiJzdHVkZW50QGV4YW1wbGUuY29tIn0.Rhg7gB7eY0qJYAoQhiMnNXT847z5zGs_pmjKQtKSET0'
            }
        });

        fireEvent.change(emailInput, { target: { value: 'user@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(assignMock).toHaveBeenCalledWith('http://localhost:3000/student');
        });
    });

    it('redirects professor to the correct URL after successful login', async () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        const emailInput = getByPlaceholderText('Please enter your email here');
        const passwordInput = getByPlaceholderText('Please enter your password here');
        const submitButton = getByText('LOG IN');

        // Mock the window.location.assign function
        const assignMock = jest.fn();
        delete window.location;
        window.location = { assign: assignMock };

        axios.post.mockResolvedValue({
            data: {
                token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmVkZWUzY2VmYzU3ZTM4ZmEzNDU5ZSIsInJvbGUiOiJwcm9mZXNzb3IiLCJlbWFpbCI6InByb2Zlc3NvckBleGFtcGxlLmNvbSJ9.hla4XfgiTPVK4GR5YsVgH35AHz8h0VPhEnoZw7o7GG0'
            }
        });

        fireEvent.change(emailInput, { target: { value: 'user@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(assignMock).toHaveBeenCalledWith('http://localhost:3000/professor');
        });
    });

    it('redirects admin to the correct URL after successful login', async () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        const emailInput = getByPlaceholderText('Please enter your email here');
        const passwordInput = getByPlaceholderText('Please enter your password here');
        const submitButton = getByText('LOG IN');

        // Mock the window.location.assign function
        const assignMock = jest.fn();
        delete window.location;
        window.location = { assign: assignMock };

        axios.post.mockResolvedValue({
            data: {
                token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmVkZjg3Y2VmYzU3ZTM4ZmEzNDU5ZiIsInJvbGUiOiJhZG1pbiIsImVtYWlsIjoiYWRtaW5AZXhhbXBsZS5jb20ifQ.tVkKAgvbC90yQ_s6sUPu3ySQP-yPus5FV2Dg41Wofms'
            }
        });

        fireEvent.change(emailInput, { target: { value: 'user@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(assignMock).toHaveBeenCalledWith('http://localhost:3000/admin');
        });
    });

    it('displays server-side validation errors', async () => {
        const { getByPlaceholderText, getByText } = render(<Login />);
        const emailInput = getByPlaceholderText('Please enter your email here');
        const passwordInput = getByPlaceholderText('Please enter your password here');
        const submitButton = getByText('LOG IN');

        axios.post.mockRejectedValue({ response: { data: { message: 'User not found.' } } });

        fireEvent.change(emailInput, { target: { value: 'user@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Error:[object Object]');
        });

        axios.post.mockRejectedValue({ response: { data: { message: 'Incorrect password.' } } });

        fireEvent.change(emailInput, { target: { value: 'user@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrong_password' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledTimes(2);
            expect(window.alert).toHaveBeenCalledWith('Error:[object Object]');
            expect(window.alert).toHaveBeenCalledWith('Error:[object Object]');
        });
    });






});
