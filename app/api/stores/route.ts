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

// POST create new store
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, code } = body;

    if (!name || !code) {
      return NextResponse.json(
        { success: false, error: 'Name and code are required' },
        { status: 400 }
      );
    }

    const store = await prisma.store.create({
      data: {
        name,
        code: code.toUpperCase(),
      },
    });

    return NextResponse.json({
      success: true,
      data: store,
    });
  } catch (error: any) {
    console.error('Error creating store:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Store with this name or code already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to create store' },
      { status: 500 }
    );
  }
}

// DELETE store
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Store ID is required' },
        { status: 400 }
      );
    }

    await prisma.store.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Store deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting store:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete store' },
      { status: 500 }
    );
  }
}
