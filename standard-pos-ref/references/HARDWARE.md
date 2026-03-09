# POS Hardware Integration

This document describes how to integrate standard POS hardware (barcode scanners and receipt printers) with a Next.js web application.

## Barcode Scanners

### Standard USB Scanners (Keyboard Wedge)
Most USB barcode scanners operate in "Keyboard Wedge" mode, meaning they simulate keyboard input. When a barcode is scanned, the scanner types the characters and usually appends an "Enter" key press.

#### Integration Strategy
1.  **Global Listener:** Add a global `keydown` event listener to capture scanner input, even if no input field is focused.
2.  **Debouncing:** Use a buffer to collect keystrokes. If the time between keystrokes is very short (< 50ms), it's likely from a scanner.
3.  **Prefix/Suffix:** Configure your scanner to add a specific prefix (e.g., `STX` or `~`) or suffix (e.g., `Enter`) to reliably detect scans.

#### Example Logic (React Hook)
```typescript
import { useEffect, useState } from 'react';

export const useBarcodeScanner = (onScan: (code: string) => void) => {
  useEffect(() => {
    let buffer = '';
    let timeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if (e.key === 'Enter') {
        if (buffer.length > 0) {
          onScan(buffer);
          buffer = '';
        }
      } else {
        buffer += e.key;
        // Reset buffer if typing is too slow (manual entry vs scanner)
        clearTimeout(timeout);
        timeout = setTimeout(() => buffer = '', 100); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScan]);
};
```

## Receipt Printers

### Thermal Printers (ESCPOS)
Thermal printers often use the ESC/POS command set.

#### WebUSB API (Direct Connection)
For modern browsers (Chrome/Edge), you can use the WebUSB API to communicate directly with USB printers.

1.  **Request Device:** `navigator.usb.requestDevice({ filters: [{ vendorId: ... }] })`
2.  **Open Session:** `device.open()` -> `device.selectConfiguration(1)` -> `device.claimInterface(0)`
3.  **Send Data:** Convert ESC/POS commands to `Uint8Array` and send via `device.transferOut()`.

#### Local Print Server (Proxy)
If WebUSB is not an option (e.g., Safari, or networked printers), run a small local server (e.g., Node.js or Python) that exposes a localhost API.

1.  **Browser:** POST print data to `http://localhost:8080/print`
2.  **Server:** Receives data and forwards it to the printer driver or raw device path (`/dev/usb/lp0` or `LPT1`).
