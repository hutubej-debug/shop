import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');

    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId: parseInt(categoryId) } : {},
      include: {
        category: true,
        priceHistory: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch products',
      },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, categoryId, price } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name and categoryId are required',
        },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        categoryId: parseInt(categoryId),
      },
      include: {
        category: true,
      },
    });

    // If price is provided, create price history entry
    if (price) {
      await prisma.priceHistory.create({
        data: {
          productId: product.id,
          price: parseFloat(price),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create product',
      },
      { status: 500 }
    );
  }
}
