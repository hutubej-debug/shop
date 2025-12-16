import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { emitItemUpdated, emitItemDeleted } from '@/lib/socket';

// GET single item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const item = await prisma.item.findUnique({
      where: { id },
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

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch item',
      },
      { status: 500 }
    );
  }
}

// PUT update item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { productId, storeId, quantity, notes, isBought } = body;

    const item = await prisma.item.update({
      where: { id },
      data: {
        ...(productId && { productId: parseInt(productId) }),
        ...(storeId && { storeId: parseInt(storeId) }),
        ...(quantity !== undefined && { quantity: parseInt(quantity) }),
        ...(notes !== undefined && { notes }),
        ...(isBought !== undefined && { isBought }),
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
    emitItemUpdated(item);

    return NextResponse.json({
      success: true,
      data: item,
      message: 'Item updated successfully',
    });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update item',
      },
      { status: 500 }
    );
  }
}

// DELETE item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.item.delete({
      where: { id },
    });

    // Emit Socket.IO event
    emitItemDeleted(id);

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete item',
      },
      { status: 500 }
    );
  }
}
