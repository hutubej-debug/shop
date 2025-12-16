import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emitItemCreated } from '@/lib/socket';

// GET all items
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const storeId = searchParams.get('storeId');
    const isBought = searchParams.get('isBought');

    const items = await prisma.item.findMany({
      where: {
        ...(storeId && { storeId: parseInt(storeId) }),
        ...(isBought !== null && { isBought: isBought === 'true' }),
      },
      include: {
        product: {
          include: {
            category: true,
            priceHistory: {
              orderBy: { recordedAt: 'desc' },
              take: 1,
            },
          },
        },
        store: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: items,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch items',
      },
      { status: 500 }
    );
  }
}

// POST create new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, storeId, quantity = 1, notes } = body;

    if (!productId || !storeId) {
      return NextResponse.json(
        {
          success: false,
          error: 'productId and storeId are required',
        },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: {
        productId: parseInt(productId),
        storeId: parseInt(storeId),
        quantity: parseInt(quantity),
        notes,
      },
      include: {
        product: {
          include: {
            category: true,
            priceHistory: {
              orderBy: { recordedAt: 'desc' },
              take: 1,
            },
          },
        },
        store: true,
      },
    });

    // Emit Socket.IO event
    emitItemCreated(item);

    return NextResponse.json({
      success: true,
      data: item,
      message: 'Item added to shopping list',
    });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create item',
      },
      { status: 500 }
    );
  }
}
