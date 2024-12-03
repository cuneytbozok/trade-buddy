export const PasswordResetEmail = ({ resetUrl, name }) => (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', lineHeight: '1.5', color: '#333' }}>
      <h2 style={{ color: '#4CAF50' }}>Password Reset Request</h2>
      <p>Hello {name || 'User'},</p>
      <p>
        We received a request to reset your password. Click the button below to reset your password:
      </p>
      <a
        href={resetUrl}
        style={{
          display: 'inline-block',
          margin: '20px 0',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
        }}
      >
        Reset Password
      </a>
      <p>
        If you didn’t request a password reset, you can ignore this email. Your password will remain
        the same.
      </p>
      <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '20px 0' }} />
      <p style={{ fontSize: '12px', color: '#666' }}>
        If the button above doesn't work, copy and paste this link into your browser: <br />
        <a href={resetUrl} style={{ color: '#4CAF50' }}>
          {resetUrl}
        </a>
      </p>
      <p style={{ fontSize: '12px', color: '#999' }}>
        This link will expire in 1 hour.
      </p>
    </div>
  );