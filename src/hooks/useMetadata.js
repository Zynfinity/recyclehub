import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const useMetadata = (title, description) => {
    const pathname = usePathname();

    useEffect(() => {
        document.title = title;

        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = description;
            document.head.appendChild(meta);
        }

        return () => {
        };

    }, [title, description, pathname]);
};

export default useMetadata;
