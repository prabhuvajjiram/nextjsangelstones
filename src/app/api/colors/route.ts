import { NextResponse } from 'next/server';
import { strapi } from '@/lib/strapi';
import { withCache, cacheKeys } from '@/lib/cache';

interface ColorImage {
  name: string;
  path: string;
  category: string;
  hexCode?: string;
  available?: boolean;
}

export async function GET() {
  try {
    // Use cache wrapper with 10-minute TTL for colors (they change infrequently)
    const colorImages = await withCache(
      cacheKeys.colorVarieties(),
      async () => {
        // Fetch color varieties from Strapi
        const colorVarieties = await strapi.getColorVarieties();
        
        // Transform to match the expected format for your frontend
        return colorVarieties.map(color => ({
          name: color.name,
          path: color.thumbnail ? strapi.getMediaUrl(color.thumbnail.url) : `/images/colors/${color.slug}.jpg`,
          category: 'colors',
          hexCode: color.hexCode,
          available: color.available,
          // Additional properties for enhanced functionality
          slug: color.slug,
          id: color.documentId,
          description: strapi.richTextToPlainText(color.description || []),
          displayOrder: color.displayOrder,
        }));
      },
      600000 // 10 minutes cache
    );

    return NextResponse.json(colorImages);
  } catch (error) {
    console.error('Error fetching color varieties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch color varieties' },
      { status: 500 }
    );
  }
}
