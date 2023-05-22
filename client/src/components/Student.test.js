import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import Student from './Student';
import axios from '../axios';


describe('Student Component with mocked axios', () => {
    let getSpy;

    beforeEach(() => {
        getSpy = jest.spyOn(axios, 'get');
    });

    test('displays pie chart container when a course is clicked', async () => {
        getSpy
            .mockResolvedValueOnce({ data: [{ name: 'Mock Course', _id: '1' }] })
            .mockResolvedValueOnce({ data: { present: 10, absent: 2, _id: '1' } });

        render(<Student />);
        const coursesLink = screen.getByText(/Courses/i);

        fireEvent.click(coursesLink);

        const courseRow = await screen.findByTestId('courseRow');
        fireEvent.click(courseRow);

        const pieChartContainer = await screen.findByTestId('pieChartContainer');
        expect(pieChartContainer).toBeInTheDocument();
    });

    afterEach(() => {
        getSpy.mockRestore();
    });
});



describe('Student Component', () => {

    test('renders Welcome text Student', () => {
        render(<Student />);
        const welcomeElement = screen.getByText(/Welcome!/i);
        expect(welcomeElement).toBeInTheDocument();
    });

    test('renders Profile link Student', () => {
        render(<Student />);
        const profileLink = screen.getByText(/Profile/i);
        expect(profileLink).toBeInTheDocument();
    });

    test('renders Courses link Student', () => {

        render(<Student />);
        const coursesLink = screen.getByText(/Courses/i);
        expect(coursesLink).toBeInTheDocument();
    });

    test('renders Log out link Student', () => {
        render(<Student />);
        const logoutLink = screen.getByText(/Log out/i);
        expect(logoutLink).toBeInTheDocument();
    });

    test('shows Student Profile when Profile link is clicked', async () => {
        render(<Student />);
        const profileLink = screen.getByText(/Profile/i);

        fireEvent.click(profileLink);

        const studentProfile = await screen.findByText(/Student Profile/i);
        expect(studentProfile).toBeInTheDocument();
    });

    test('shows Courses when Courses link is clicked', async () => {
        render(<Student />);
        const coursesLink = screen.getByText(/Courses/i);

        fireEvent.click(coursesLink);

        // const courseRow = await screen.findByText(/Mock Course/i);
        // fireEvent.click(courseRow);

        const coursesToShow = await screen.findByTestId("coursesToShow");
        expect(coursesToShow).toBeInTheDocument();
    });

    it('toggles the change password mode', async () => {
        render(<Student />);
        // Find the Profile button and click it
        const profileButton = screen.getByText('Profile');
        fireEvent.click(profileButton);

        // Check if the student Profile text is displayed after the click event
        const studentProfileElement = await screen.findByTestId('student-prof');
        expect(studentProfileElement).toBeInTheDocument();
        // Find the Change Password button and click it
        const changePasswordBtn = screen.getByText('Change Password');
        fireEvent.click(changePasswordBtn);

        // Find the Change Password header using data-testid
        const changePasswordHeader = await screen.findByTestId('change-password-header');
        expect(changePasswordHeader).toBeInTheDocument();
    });

    test('edit profile form appears when the "Edit Profile" button is clicked', async () => {
        render(<Student />);
        const profileButton = screen.getByText('Profile');
        fireEvent.click(profileButton);

        // Check if the Admin Profile text is displayed after the click event
        const studentProfileElement = await screen.findByTestId('student-prof');
        expect(studentProfileElement).toBeInTheDocument();
        // Find the Edit Porifle button and click it
        const editProfileBtn = screen.getByText('Edit Profile');
        fireEvent.click(editProfileBtn);

        // Find the Edit Profile header using data-testid
        const editProfileHeader = await screen.findByTestId('edit-header');
        expect(editProfileHeader).toBeInTheDocument();
    });

    test('edit profile form submits successfully', async () => {
        jest.spyOn(axios, 'put').mockResolvedValue({ data: {} });

        render(<Student />);
        const profileButton = screen.getByText(/Profile/i);
        fireEvent.click(profileButton);

        const editProfileBtn = await screen.findByText('Edit Profile');
        fireEvent.click(editProfileBtn);

        const firstNameInput = screen.getByLabelText('Name:');
        const lastNameInput = screen.getByLabelText('Surname:');
        const saveChangesBtn = screen.getByText('Save Changes');

        fireEvent.change(firstNameInput, { target: { value: 'NewFirstName' } });
        fireEvent.change(lastNameInput, { target: { value: 'NewLastName' } });

        fireEvent.click(saveChangesBtn);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledTimes(1);
        });
    });

    test('change password form submits successfully', async () => {
        jest.spyOn(axios, 'put').mockResolvedValue({ data: {} });

        render(<Student />);
        const profileButton = screen.getByText(/Profile/i);
        fireEvent.click(profileButton);

        const changePasswordBtn = await screen.findByText('Change Password');
        fireEvent.click(changePasswordBtn);

        const oldPasswordInput = screen.getByLabelText("Current Password:");
        const newPasswordInput = screen.getByLabelText("New Password:");
        const saveChangesBtn = screen.getByText("Save Changes");

        fireEvent.change(oldPasswordInput, { target: { value: 'oldPassword' } });
        fireEvent.change(newPasswordInput, { target: { value: 'newPassword' } });

        fireEvent.click(saveChangesBtn);

        await waitFor(() => {
            expect(axios.put).toHaveBeenCalledTimes(2);
        });
    });
});
