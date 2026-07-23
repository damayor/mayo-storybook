import React, { useState, useCallback, useImperativeHandle } from 'react';

export const LogMessage = React.forwardRef<{ log: (msg: string) => void }>((props, ref) => {
  const [message, setMessage] = useState<string>('');

  const log = useCallback((msg: string) => {
    setMessage(msg);
    // Auto-clear after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  }, []);

  useImperativeHandle(ref, () => ({ log }), [log]);

  return <>{message ? message : '✓ Ready'}</>;
});

LogMessage.displayName = 'LogMessage';
