import React from 'react';
import { render, fireEvent, screen, waitFor, within } from '@testing-library/react';
import Admin from './Admin';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import axios from '../axios';

jest.mock('../axios');

jest.mock('../axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Mocking the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));




describe('Admin Component', () => {

  test('renders Welcome text Student', () => {
    render(<Admin />);
    const welcomeElement = screen.getByText(/Welcome!/i);
    expect(welcomeElement).toBeInTheDocument();
  });
  test('renders Admin component without crashing', () => {
    render(<Admin />);
  });


  test('renders Profile link Admin', () => {
    render(<Admin />);
    const profileLink = screen.getByText(/Profile/i);
    expect(profileLink).toBeInTheDocument();
  });

  test('renders Courses link Admin', () => {
    render(<Admin />);
    const coursesLink = screen.getByText(/Courses/i);
    expect(coursesLink).toBeInTheDocument();
  });

  test('renders Log out link Admin', () => {
    render(<Admin />);
    const logoutLink = screen.getByText(/Log out/i);
    expect(logoutLink).toBeInTheDocument();
  });

  it('should render Admin Profile text after clicking Profile button', async () => {
    render(<Admin />);

    // Find the Profile button and click it
    const profileButton = screen.getByText('Profile');
    fireEvent.click(profileButton);

    // Check if the Admin Profile text is displayed after the click event
    const adminProfileElement = await screen.findByTestId('admin-prof');
    expect(adminProfileElement).toBeInTheDocument();
  });

  it('toggles the change password mode', async () => {
    render(<Admin />);
    // Find the Profile button and click it
    const profileButton = screen.getByText('Profile');
    fireEvent.click(profileButton);

    // Check if the Admin Profile text is displayed after the click event
    const adminProfileElement = await screen.findByTestId('admin-prof');
    expect(adminProfileElement).toBeInTheDocument();
    // Find the Change Password button and click it
    const changePasswordBtn = screen.getByText('Change Password');
    fireEvent.click(changePasswordBtn);

    // Find the Change Password header using data-testid
    const changePasswordHeader = await screen.findByTestId('change-password-header');
    expect(changePasswordHeader).toBeInTheDocument();
  });




  test('edit profile form appears when the "Edit Profile" button is clicked', async () => {
    render(<Admin />);
    const profileButton = screen.getByText('Profile');
    fireEvent.click(profileButton);

    // Check if the Admin Profile text is displayed after the click event
    const adminProfileElement = await screen.findByTestId('admin-prof');
    expect(adminProfileElement).toBeInTheDocument();
    // Find the Edit Porifle button and click it
    const editProfileBtn = screen.getByText('Edit Profile');
    fireEvent.click(editProfileBtn);

    // Find the Edit Profile header using data-testid
    const editProfileHeader = await screen.findByTestId('edit-header');
    expect(editProfileHeader).toBeInTheDocument();
  });

  test('shows Courses when Courses link is clicked', async () => {
    render(<Admin />);
    const coursesLink = screen.getByText(/Courses/i);

    fireEvent.click(coursesLink);

    // const courseRow = await screen.findByText(/Mock Course/i);
    // fireEvent.click(courseRow);

    const semestersToShow = await screen.findByTestId("semesterSelection");
    expect(semestersToShow).toBeInTheDocument();
  });
  test('submits the change password form successfully', async () => {
    axios.put.mockResolvedValue({ data: { message: 'Password changed successfully!' } });

    render(<Admin />);

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
      expect(axios.put).toHaveBeenCalledTimes(1);
    });
  });

  test('date selection is displayed after selecting a professor', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          course: 'Math',
        },
      ],
    });

    render(<Admin />);
    fireEvent.click(screen.getByText('Courses'));

    await waitFor(() => screen.getByText('Select Professor'));

    fireEvent.click(screen.getByTestId('prof-0'));

    await waitFor(() => screen.getByText('Select Date'));
  });

  test('attendance list is displayed after selecting a date', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: '1',
          firstName: 'John',
          lastName: 'Doe',
          course: 'Math',
        },
      ],
    });

    axios.get.mockResolvedValueOnce({
      data: {
        attendance_dates: [
          {
            id: '1',
            date: '2023-01-01',
          },
        ],
      },
    });

    axios.get.mockResolvedValueOnce({
      data: {
        records: [
          {
            id: '1',
            studentId: {
              _id: '1',
              firstName: 'Alice',
              lastName: 'Smith',
            },
            status: 'present',
          },
        ],
      },
    });

    render(<Admin />);
    fireEvent.click(screen.getByText('Courses'));

    await waitFor(() => screen.getByText('Select Professor'));

    fireEvent.click(screen.getByTestId('prof-0'));

    await waitFor(() => screen.getByText('Select Date'));

    fireEvent.click(screen.getByTestId('date-0'));

    await waitFor(() => screen.getByText('Attendance List'));
  });

  test('submits the Edit Profile form successfully', async () => {
    axios.put.mockResolvedValue({ data: { message: 'Profile updated successfully!' } });

    render(<Admin />);

    const profileButton = screen.getByText(/Profile/i);
    fireEvent.click(profileButton);

    const editProfileBtn = await screen.findByText('Edit Profile');
    fireEvent.click(editProfileBtn);

    const firstNameInput = screen.getByLabelText("Name:");
    const lastNameInput = screen.getByLabelText("Surname:");
    const saveChangesBtn = screen.getByText("Save Changes");

    fireEvent.change(firstNameInput, { target: { value: 'NewFirstName' } });
    fireEvent.change(lastNameInput, { target: { value: 'NewLastName' } });

    fireEvent.click(saveChangesBtn);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledTimes(2);
    });
  });



});


