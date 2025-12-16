import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all stores
export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: stores,
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch stores',
      },
      { status: 500 }
    );
  }
}
