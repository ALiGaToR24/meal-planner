"use client";
import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function BarcodeScanner({ onDetected, onClose }:{
  onDetected: (code: string) => void; onClose: ()=>void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let stop = false;

    (async () => {
      try {
        const controls = await codeReader.decodeFromVideoDevice(
          undefined,
          videoRef.current!,
          (result, err) => {
            if (stop) return;
            if (result) {
              stop = true;
              controls.stop();
              onDetected(result.getText());
            }
          }
        );
        return () => { stop = true; controls?.stop(); };
      } catch (e:any) {
        setError(e?.message || "Не удалось открыть камеру");
      }
    })();

    return () => { stop = true; };
  }, [onDetected]);

  return (
    <div className="modal fade show d-block" role="dialog" tabIndex={-1}>
      <div className="modal-dialog modal-fullscreen-sm-down">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title">Сканер</h5>
            <button className="btn-close btn-close-white" onClick={onClose}/>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="ratio ratio-4x3 round-2xl overflow-hidden">
              <video ref={videoRef} className="w-100 h-100 object-fit-cover" autoPlay muted playsInline />
            </div>
            <p className="small text-muted mt-2">Наведи камеру на штрих-код</p>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}/>
    </div>
  );
}
