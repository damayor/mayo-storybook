/**
 * Email Service
 * Handles sending contact form emails to the backend
 */

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  error?: string;
}

const API_ENDPOINT = '/api/send-email';

/**
 * Send contact form data via email
 * @param formData - Contact form data (name, email, message)
 * @returns Promise with success status and message
 */
export const sendContactEmail = async (
  formData: ContactFormData
): Promise<EmailResponse> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        message: 'Failed to send email',
        error: errorData.error || 'Unknown error occurred',
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Email sent successfully!',
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Network error';
    return {
      success: false,
      message: 'Failed to send email',
      error: errorMessage,
    };
  }
};
