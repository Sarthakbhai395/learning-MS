import ReactPlayer from 'react-player';
import { useAuth } from '../../../context/AuthContext';

export default function VideoPlayer({ videoUrl }) {
  const { token } = useAuth();

  return (
    <div className="aspect-video w-full">
      <ReactPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        controls
        config={{
          file: {
            attributes: {
              crossOrigin: 'anonymous',
            },
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        }}
      />
    </div>
  );
}